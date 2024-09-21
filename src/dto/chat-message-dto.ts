import { StoredDto } from "./stored-dto";

export class ChatMessageDto extends StoredDto {
  userID: string; // UUIDv4 of the user who sent the message
  chatID: string; // UUIDv4 of the associated chat (required)
  role: string; // Required, role (e.g., 'user', 'assistant', etc.)
  message: string; // Required, the message text
  fileKeys: string[]; // Required, but can be empty (array of S3 file keys)
  toolInput?: object; // Optional, no fixed schema (input object, dependent on tools)
  toolResult?: object; // Optional, no fixed schema (result object, dependent on tools)
}
