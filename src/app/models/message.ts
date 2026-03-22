import { ROLLTYPE } from "../utils/constants";

export type MessageRole = ROLLTYPE.ROLE_USER | ROLLTYPE.ROLE_ASSISTANT | ROLLTYPE.ROLE_SYSTEM;
export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: Date;
}
