export class FrameBuffer {
  private pixels: string[];
  constructor(public width: number, public height: number, fill = '#000000') { this.pixels = Array(width * height).fill(fill); }
  setPixel(x: number, y: number, color: string) { if (x >= 0 && x < this.width && y >= 0 && y < this.height) this.pixels[y * this.width + x] = color; }
  getPixel(x: number, y: number) { return this.pixels[y * this.width + x]; }
  clear(color = '#000000') { this.pixels.fill(color); }
  toArray() { return [...this.pixels]; }
}
