import { Schema } from "ajv";
import { Agent } from "./agent";
import { Interaction } from "./interaction";
import { Entity } from "./base/entity";

export interface SessionProps {
  initiatingAgent: Agent;
  interactions: Interaction[];
  status: "open" | "closed";
  ttl: number; // Time to Live in milliseconds
}

export class Session extends Entity<SessionProps> {
  constructor(
    props: SessionProps,
    id?: string,
    created?: string,
    updated?: string
  ) {
    super(props, id, created, updated);
    // Optionally validate props here
  }

  // Getters
  get initiatingAgent(): Agent {
    return this.props.initiatingAgent;
  }

  get interactions(): Interaction[] {
    return this.props.interactions;
  }

  get status(): "open" | "closed" {
    return this.props.status;
  }

  get ttl(): number {
    return this.props.ttl;
  }

  // Setters
  set status(value: "open" | "closed") {
    this.props.status = value;
    this.setUpdatedDate();
  }

  // Methods
  public startSession(): void {
    this.status = "open";
    this.addDomainEvent({
      source: "Session",
      eventName: "SessionStarted",
      event: { sessionId: this.id },
      eventVersion: "1",
    });
  }

  public closeSession(): void {
    this.status = "closed";
    this.setUpdatedDate();
    this.addDomainEvent({
      source: "Session",
      eventName: "SessionClosed",
      event: { sessionId: this.id },
      eventVersion: "1",
    });
  }

  public addInteraction(interaction: Interaction): void {
    this.props.interactions.push(interaction);
    this.setUpdatedDate();
    this.addDomainEvent({
      source: "Session",
      eventName: "InteractionAdded",
      event: { sessionId: this.id, interactionId: interaction.id },
      eventVersion: "1",
    });
  }

  public isExpired(): boolean {
    const now = Date.now();
    const createdAt = new Date(this.created).getTime();
    return now - createdAt > this.ttl;
  }

  // Optionally, you can include validation
  protected validate(schema: Schema): void {
    super.validate(schema);
  }

  public async runSession(
    agent: Agent,
    maxTurns: number = 10,
    executeTools: boolean = true,
    contextVariables: Record<string, any> = {},
    debug: boolean = false
  ): Promise<void> {
    let activeAgent = agent;
    const history = [...this.interactions];
    const initialMessageCount = history.length;
    let responseAddenda = "";
    let directResponseSent = false;

    try {
      while (
        this.shouldContinueConversation(
          history,
          initialMessageCount,
          maxTurns,
          activeAgent
        )
      ) {
        const completionInteraction = await activeAgent.getCompletion(history);

        // Update session ID in interaction
        completionInteraction.sessionId = this.id;

        this.addInteraction(completionInteraction);
        history.push(completionInteraction);

        if (this.shouldHandleTools(completionInteraction, executeTools)) {
          const functionResult = await activeAgent.executeTools({
            session: this,
            interaction: completionInteraction,
            contextVariables,
            debug,
          });

          responseAddenda += functionResult.responseAddenda || "";
          directResponseSent = functionResult.directResponseSent;

          functionResult.interactions.forEach((interaction) => {
            this.addInteraction(interaction);
            history.push(interaction);
          });

          contextVariables = {
            ...contextVariables,
            ...functionResult.contextVariables,
          };

          if (functionResult.agent) {
            activeAgent = functionResult.agent;
          }

          if (directResponseSent) {
            break;
          }
        } else {
          break;
        }
      }
    } catch (error) {
      // Handle error
      throw error;
    }
  }

  private shouldContinueConversation(
    history: Interaction[],
    initialMessageCount: number,
    maxTurns: number,
    activeAgent: Agent | undefined
  ): boolean {
    return history.length - initialMessageCount < maxTurns && !!activeAgent;
  }

  private shouldHandleTools(
    interaction: Interaction,
    executeTools: boolean
  ): boolean {
    return interaction.toolUse !== undefined && executeTools;
  }
}
