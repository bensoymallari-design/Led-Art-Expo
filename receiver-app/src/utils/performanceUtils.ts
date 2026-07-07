export class FpsMeter {
  private frames = 0; private started = Date.now();
  tick() { this.frames += 1; const elapsed = Date.now() - this.started; if (elapsed >= 1000) { const fps = Math.round((this.frames * 1000) / elapsed); this.frames = 0; this.started = Date.now(); return fps; } return undefined; }
}
