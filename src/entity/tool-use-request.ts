export class ToolUseRequest {
  name: string;
  input: Record<string, any>;
  toolUseId?: string; // Optional ID to track tool usage

  constructor(name: string, input: Record<string, any>, toolUseId?: string) {
    this.name = name;
    this.input = input;
    this.toolUseId = toolUseId;
  }
}
