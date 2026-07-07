import { Content } from 'led-art-shared';
import { playbackService } from './PlaybackService';

export class ContentReceiver {
  async handleContent(content: Content, autoPlay = true) {
    await playbackService.queueContent(content);
    if (autoPlay) playbackService.startAutoPlay();
  }
}
export const contentReceiver = new ContentReceiver();
