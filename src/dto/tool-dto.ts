import { ToolInputSchema } from "@aws-sdk/client-bedrock-runtime";

export class ToolDto {
  name: string;
  description: string;
  inputSchema: ToolInputSchema;
}
