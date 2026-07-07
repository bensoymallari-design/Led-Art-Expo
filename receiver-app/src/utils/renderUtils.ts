import { Content } from 'led-art-shared';
export function contentLabel(content?: Content) { return content ? `${content.name} (${content.width}x${content.height})` : 'No content loaded'; }
export function scaleToFit(width: number, height: number, maxWidth: number, maxHeight: number) { return Math.min(maxWidth / width, maxHeight / height); }
