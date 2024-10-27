export class ToolUseResponse {
  toolUseId: string;
  content: Array<Record<string, any>>;

  constructor(toolUseId: string, content: Array<Record<string, any>>) {
    this.toolUseId = toolUseId;
    this.content = content;
  }
}
