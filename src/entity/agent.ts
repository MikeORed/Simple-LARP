// Agent.ts
import { Schema } from "ajv";
import { Entity } from "./base/entity";
import { Interaction, InteractionProps } from "./interaction";
import { FunctionResult, Tool } from "./tool/tool";
import { Session } from "./session";
import { BedrockLLMService } from "../domain/llm-service/bedrock-llm-service";

const bedrockLLMService = new BedrockLLMService();

export interface AgentProps {
  name: string;
  tools: Tool[];
}

export class Agent extends Entity<AgentProps> {
  constructor(
    props: AgentProps,
    id?: string,
    created?: string,
    updated?: string
  ) {
    super(props, id, created, updated);
    // Optionally validate props here
    // this.validate(schema);
  }

  // Getters
  get name(): string {
    return this.props.name;
  }

  get tools(): Tool[] {
    return this.props.tools;
  }

  // Setters
  set name(value: string) {
    this.props.name = value;
    this.setUpdatedDate();
  }

  set tools(value: Tool[]) {
    this.props.tools = value;
    this.setUpdatedDate();
  }

  // Method to get completion from LLM
  public async getCompletion(history: Interaction[]): Promise<Interaction> {
    const completion = await bedrockLLMService.getCompletion(this, history);
    return this.processCompletion(completion);
  }

  private processCompletion(completion: any): Interaction {
    // Process LLM completion into an Interaction
    const interactionProps: InteractionProps = {
      sessionId: "", // To be set by caller
      agentId: this.id,
      content: completion.content,
      type: "agent",
      toolUse: completion.toolUse, // Assuming completion includes tool usage
    };
    return new Interaction(interactionProps);
  }

  // Method to handle function calls (tool executions)
  public async executeTools(params: {
    session: Session;
    interaction: Interaction;
    contextVariables: Record<string, any>;
    debug: boolean;
  }): Promise<{
    interactions: Interaction[];
    agent?: Agent;
    contextVariables: Record<string, any>;
    responseAddenda: string;
    directResponseSent: boolean;
  }> {
    const { session, interaction, contextVariables, debug } = params;

    const toolCall = interaction.toolUse;
    const functionName = toolCall?.name ?? "NoTool";
    const args = toolCall?.input ?? {};
    const functionMap = new Map(this.tools.map((tool) => [tool.name, tool]));
    const interactions: Interaction[] = [];
    let updatedContextVariables = { ...contextVariables };
    let responseAddenda = "";
    let directResponseSent = false;
    let agent: Agent | undefined;

    const tool = functionMap.get(functionName);

    if (!tool) {
      const toolNotFoundInteraction = new Interaction({
        sessionId: session.id,
        agentId: this.id,
        content: `Tool ${functionName} not found.`,
        type: "system",
      });
      interactions.push(toolNotFoundInteraction);
      return {
        interactions,
        agent,
        contextVariables: updatedContextVariables,
        responseAddenda,
        directResponseSent,
      };
    }

    try {
      const result = await tool.execute(session.id, args, contextVariables);

      const directResponse =
        typeof args === "object" &&
        !Array.isArray(args) &&
        args !== null &&
        "directResponse" in args
          ? args["directResponse"] === true
          : false;

      if (directResponse) {
        const directResponseInteraction = new Interaction({
          sessionId: session.id,
          agentId: this.id,
          content: result.value ?? "No response from tool.",
          type: "agent",
        });
        interactions.push(directResponseInteraction);
        directResponseSent = true;
      } else {
        const functionResult = this.processFunctionResult(result);

        if (functionResult.responseAddenda) {
          responseAddenda += functionResult.responseAddenda;
        }

        const functionResponseInteraction = new Interaction({
          sessionId: session.id,
          agentId: this.id,
          content:
            functionResult.value ?? "Executed successfully with no result.",
          type: "tool",
        });
        interactions.push(functionResponseInteraction);

        if (functionResult.contextVariables) {
          updatedContextVariables = {
            ...updatedContextVariables,
            ...functionResult.contextVariables,
          };
        }

        if (functionResult.agent) {
          agent = functionResult.agent;
        }
      }
    } catch (error) {
      // Handle error
      throw error;
    }

    return {
      interactions,
      agent,
      contextVariables: updatedContextVariables,
      responseAddenda,
      directResponseSent,
    };
  }

  private processFunctionResult(
    result: FunctionResult | string | Agent
  ): FunctionResult {
    if (typeof result === "string") {
      return { value: result };
    } else if (result instanceof Agent) {
      return { agent: result };
    } else {
      return result;
    }
  }

  public handOffToAgent(targetAgent: Agent): void {
    // Logic to hand off control
    // Possibly add a domain event
    this.addDomainEvent({
      source: "Agent",
      eventName: "HandOff",
      event: {
        fromAgentId: this.id,
        toAgentId: targetAgent.id,
      },
      eventVersion: "1",
    });
  }

  public processInteraction(interaction: Interaction): void {
    // Process the interaction
    // Update state if necessary
    this.setUpdatedDate();
  }

  public addTool(tool: Tool): void {
    this.props.tools.push(tool);
    this.setUpdatedDate();
  }

  // Optionally, you can include validation
  protected validate(schema: Schema): void {
    super.validate(schema);
  }
}
