type Duration = {
  hours: number;
  minutes: number;
  seconds: number;
}

class CacheStore {
  private cache: Map<string, { expiration: number; conditions: Condition[] }>;
  private duration: Duration;

  constructor(duration: Duration) {
    this.cache = new Map();
    this.duration = duration;
  }

  get(key: string) {
    const data = this.cache.get(key)
    if (!data) return null
    if (data.expiration < Date.now()) return null
    return data.conditions
  }

  set(key: string, value: Condition[]) {
    this.cache.set(key, {
      expiration: Date.now()
        + this.duration.hours * 60 * 60 * 1000
        + this.duration.minutes * 60 * 1000
        + this.duration.seconds * 1000,
      conditions: value
    });
  }
}

export { CacheStore };