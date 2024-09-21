import { StoredDto } from "./stored-dto";

export class ChatDto extends StoredDto {
  userID: string; // Required, the ID of the user
  modelID?: string; // Optional, the ID of the model used
  name?: string; // Optional, the name of the chat
  systemContexts: string[]; // Required, but can be an empty array
  tools: string[]; // Required, but can be an empty array
}
