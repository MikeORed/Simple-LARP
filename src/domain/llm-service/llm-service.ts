import { Agent, Interaction } from "../../entity";

export interface LLMService {
  getCompletion(agent: Agent, history: Interaction[]): Promise<Interaction>;
}
