const updateDuration = 50;

export function convertMinutesToTimerUnit(minutes: number): number {
  return minutes * 60 * 1000;
}

export class Timer {
  private isRunning = false;

  private endTime = new Date();

  private duration: number; // milliseconds

  private timeout: ReturnType<typeof setTimeout>;

  private tickInterval: ReturnType<typeof setInterval>;

  private tickCallback: (remain: number) => void;

  constructor(duration: number, tickCallback: (remain: number) => void) {
    this.duration = duration;
    this.tickCallback = tickCallback;
  }

  public start(callback: () => void, withTickCallback = true) {
    if (this.isRunning) {
      return;
    }
    const now = new Date();
    this.endTime = new Date(now.getTime() + this.duration);
    this.timeout = setTimeout(() => {
      callback();
      this.clear();
    }, this.duration);
    if (withTickCallback) {
      this.tickInterval = setInterval(() => {
        const remain = this.getRemainDuration(new Date());
        this.tickCallback(remain);
      }, updateDuration);
    }
    this.isRunning = true;
  }

  public pause() {
    if (!this.isRunning) {
      return;
    }
    const now = new Date();
    // update remaining duration
    this.duration = this.endTime.getTime() - now.getTime();
    clearTimeout(this.timeout);
    clearInterval(this.tickInterval);
    this.isRunning = false;
  }

  public clear() {
    this.isRunning = false;
    clearTimeout(this.timeout);
    clearInterval(this.tickInterval);
  }

  public getRemainDuration(now: Date): number {
    const remain = (this.endTime.getTime() - now.getTime()) / 1000;
    return remain > 0 ? Math.floor(remain) : 0;
  }
}
