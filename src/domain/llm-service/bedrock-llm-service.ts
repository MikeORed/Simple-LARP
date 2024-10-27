import { Agent, Interaction } from "../../entity";
import { LLMService } from "./llm-service";

export class BedrockLLMService implements LLMService {
  async getCompletion(
    agent: Agent,
    history: Interaction[]
  ): Promise<Interaction> {
    // Implement the logic to interact with Amazon Bedrock's API
    // Use the Converse API as per your requirements
    const responseContent = "Bedrock response"; // Placeholder
    return new Interaction({
      sessionId: "", // Should be set appropriately
      agentId: agent.id,
      content: responseContent,
      type: "agent",
    });
  }
}
