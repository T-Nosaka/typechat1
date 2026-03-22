import { Message } from "../models/message";

/*
 * JOB状況
 */
export enum JobStatus {
  Failed,
  IDLE,
  llming,
  llmed,
};

/*
 * GENAI Roll型
 */
export enum ROLLTYPE {
  ROLE_ASSISTANT= 'ASSISTANT',
  ROLE_DEVELOPER= 'DEVELOPER',
  ROLE_SYSTEM= 'SYSTEM',
  ROLE_TOOL= 'TOOL',
  ROLE_USER= 'USER',
}

export const IMAGEFILE_EXTENSIONS = [
  '.PNG', '.JPEG', '.JPG'
] as const;
export const VIDEOFILE_EXTENSIONS = [
  '.WEBM', '.MP4'
] as const;

export const APPTITLE="AI Chat Assistant"

// 履歴記録数
export const MAX_HISTORY = 20;

// 初期メッセージ
export const INITIAL_MESSAGES: Message[] = [
  { id: '1', role: ROLLTYPE.ROLE_ASSISTANT, content: 'こんにちは！何かお手伝いしましょうか？', createdAt: new Date() },
];


