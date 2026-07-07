export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'reconnecting' | 'offline' | 'error';
export type DeviceStatus = 'online' | 'offline' | 'unknown';
export type ContentType = 'image' | 'animation' | 'text' | 'widget' | 'playlist';
export type WidgetType = 'clock' | 'date' | 'countdown' | 'text' | 'weather';
export type EffectType = 'none' | 'scroll' | 'blink' | 'fade' | 'wipe' | 'pulse';
export type PanelOrientation = 'landscape' | 'portrait';

export interface Point {
  x: number;
  y: number;
}

export interface Rect extends Point {
  width: number;
  height: number;
}

export interface LEDPanel {
  id: string;
  name: string;
  width: number;
  height: number;
  position: Point;
  orientation: PanelOrientation;
  mirrorX: boolean;
  mirrorY: boolean;
  brightness: number;
  groupId?: string;
}

export interface Layout {
  id: string;
  name: string;
  width: number;
  height: number;
  panels: LEDPanel[];
  backgroundColor: string;
  createdAt: string;
  updatedAt: string;
}

export interface DeviceCapabilities {
  maxWidth: number;
  maxHeight: number;
  panelCount: number;
  supportsAnimation: boolean;
  supportsWidgets: boolean;
  supportsChunkedUpload: boolean;
  firmwareVersion?: string;
}

export interface Device {
  id: string;
  name: string;
  ip: string;
  wsPort: number;
  httpPort: number;
  udpPort: number;
  status: DeviceStatus;
  connectionStatus: ConnectionStatus;
  signalStrength?: number;
  latencyMs?: number;
  packetLoss?: number;
  lastSeen: string;
  capabilities: DeviceCapabilities;
  layout?: Layout;
  manual?: boolean;
  senderIp?: string;
  transferRateKbps?: number;
  uptimeSeconds?: number;
}

export interface ClockWidgetConfig {
  format: '24h' | '12h';
  showSeconds: boolean;
  timezone: 'local';
  color: string;
  fontSize: number;
  position: Rect;
}

export interface DateWidgetConfig {
  format: 'short' | 'medium' | 'long';
  color: string;
  fontSize: number;
  position: Rect;
}

export interface CountdownWidgetConfig {
  targetDate: string;
  label: string;
  showDays: boolean;
  showHours: boolean;
  showMinutes: boolean;
  showSeconds: boolean;
  color: string;
  fontSize: number;
  position: Rect;
}

export interface TextWidgetConfig {
  text: string;
  font: string;
  size: number;
  color: string;
  effect: 'scroll' | 'static' | 'blink';
  scrollDirection: 'left' | 'right' | 'up' | 'down';
  speed: number;
  position: Rect;
}

export interface WeatherWidgetConfig {
  source: 'manual' | 'sensor';
  label: string;
  temperature?: string;
  condition?: string;
  color: string;
  fontSize: number;
  position: Rect;
}

export type WidgetConfig = ClockWidgetConfig | DateWidgetConfig | CountdownWidgetConfig | TextWidgetConfig | WeatherWidgetConfig;

export interface Widget {
  id: string;
  type: WidgetType;
  name: string;
  config: WidgetConfig;
  enabled: boolean;
}

export interface AnimationFrame {
  id: string;
  durationMs: number;
  dataUri?: string;
  pixels?: string[];
}

export interface Content {
  id: string;
  name: string;
  type: ContentType;
  width: number;
  height: number;
  durationMs?: number;
  dataUri?: string;
  mimeType?: string;
  text?: string;
  color?: string;
  backgroundColor?: string;
  effect?: EffectType;
  frames?: AnimationFrame[];
  widgets?: Widget[];
  playlistItems?: Content[];
  checksum?: string;
  sizeBytes?: number;
  priority?: number;
  createdAt: string;
  updatedAt: string;
}

export interface TransferProgress {
  deviceId: string;
  contentId: string;
  bytesSent: number;
  totalBytes: number;
  percentage: number;
  status: 'queued' | 'sending' | 'complete' | 'failed' | 'retrying';
  error?: string;
}

export interface NetworkDiagnostics {
  localIp: string;
  subnetMask: string;
  interfaceName?: string;
  connectedDevices: number;
  latencyByDevice: Record<string, number>;
  packetLossByDevice: Record<string, number>;
  reconnectAttempts: Record<string, number>;
}

export interface ReceiverState {
  device: Device;
  currentContent?: Content;
  playlist: Content[];
  autoPlayEnabled: boolean;
  connectedSenders: string[];
  transferRateKbps: number;
  uptimeSeconds: number;
}
