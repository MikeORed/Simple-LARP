import { Schema } from "ajv";
import { Entity } from "./base/entity";
import { ToolUseRequest } from "./tool-use-request";
import { ToolUseResponse } from "./tool-use-response";

export interface InteractionProps {
  sessionId: string;
  agentId: string;
  content: string;
  type: "agent" | "user" | "system" | "tool";
  toolUseRequest?: ToolUseRequest;
  toolUseResponse?: ToolUseResponse;
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

  get toolUseRequest(): ToolUseRequest | undefined {
    return this.props.toolUseRequest;
  }

  get toolUseResponse(): ToolUseResponse | undefined {
    return this.props.toolUseResponse;
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
