import { Content, Device, Layout, TransferProgress } from './types';

export type LedArtMessageType =
  | 'hello'
  | 'hello_ack'
  | 'ping'
  | 'pong'
  | 'content'
  | 'content_ack'
  | 'content_chunk'
  | 'content_complete'
  | 'layout_sync'
  | 'play'
  | 'pause'
  | 'clear'
  | 'status'
  | 'error';

export interface LedArtMessage<T = unknown> {
  id: string;
  type: LedArtMessageType;
  timestamp: string;
  sourceDeviceId: string;
  targetDeviceId?: string;
  payload: T;
}

export interface HelloPayload {
  app: 'sender' | 'receiver';
  device: Partial<Device>;
  protocolVersion: string;
  password?: string;
}

export interface ContentChunkPayload {
  contentId: string;
  transferId: string;
  chunkIndex: number;
  totalChunks: number;
  base64: string;
  checksum: string;
}

export interface ContentAckPayload {
  contentId: string;
  accepted: boolean;
  progress?: TransferProgress;
  error?: string;
}

export interface LayoutSyncPayload {
  layout: Layout;
}

export interface ContentPayload {
  content: Content;
  autoPlay: boolean;
}

const PROTOCOL_VERSION = '1.0.0';

export function protocolVersion() {
  return PROTOCOL_VERSION;
}

export function createMessage<T>(type: LedArtMessageType, sourceDeviceId: string, payload: T, targetDeviceId?: string): LedArtMessage<T> {
  return {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    type,
    timestamp: new Date().toISOString(),
    sourceDeviceId,
    targetDeviceId,
    payload,
  };
}

export function encodeMessage(message: LedArtMessage): string {
  return JSON.stringify(message);
}

export function decodeMessage(raw: string): LedArtMessage {
  const parsed = JSON.parse(raw) as LedArtMessage;
  if (!parsed.id || !parsed.type || !parsed.timestamp || !parsed.sourceDeviceId) {
    throw new Error('Invalid LED Art protocol message');
  }
  return parsed;
}
