import { Schema } from "ajv";
import { Entity } from "./base/entity";
import { ToolUseBlock } from "@aws-sdk/client-bedrock-runtime";

export interface InteractionProps {
  sessionId: string;
  agentId: string;
  content: string;
  type: "agent" | "user" | "system" | "tool";
  toolUse?: ToolUseBlock; // Added property
}

export class Interaction extends Entity<InteractionProps> {
  constructor(
    props: InteractionProps,
    id?: string,
    created?: string,
    updated?: string
  ) {
    super(props, id, created, updated);
    // Optionally validate props here
  }

  // Getters
  get sessionId(): string {
    return this.props.sessionId;
  }

  get agentId(): string {
    return this.props.agentId;
  }

  get content(): string {
    return this.props.content;
  }

  get type(): "agent" | "user" | "system" | "tool" {
    return this.props.type;
  }

  get toolUse(): ToolUseBlock | undefined {
    return this.props.toolUse;
  }

  // Setters
  set content(value: string) {
    this.props.content = value;
    this.setUpdatedDate();
  }

  set sessionId(value: string) {
    this.props.sessionId = value;
    this.setUpdatedDate();
  }

  // Methods
  public process(): void {
    // Interaction processing logic
    // Possibly add a domain event
    this.addDomainEvent({
      source: "Interaction",
      eventName: "Processed",
      event: { interactionId: this.id },
      eventVersion: "1",
    });
  }

  // Optionally, you can include validation
  protected validate(schema: Schema): void {
    super.validate(schema);
  }
}
