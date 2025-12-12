type Subscriber = (list: string[]) => void;

const STORAGE_KEY = 'tcc.favorites';
const MAX_ITEMS = 5;

function isValidCurrency(code: string): boolean {
  return /^[A-Z]{3}$/.test(code);
}

class Favorites {
  private inMemory: string[] = [];
  private subscribers: Subscriber[] = [];
  private useLocalStorage: boolean = true;

  constructor() {
    this.init();
    try {
      window.addEventListener('storage', this.handleStorageEvent.bind(this));
    } catch (e) {
      // ignore in non-browser environments
    }
  }

  private handleStorageEvent(e: StorageEvent): void {
    if (e.key === STORAGE_KEY) {
      this.loadFromStorage();
      this.notify();
    }
  }

  private loadFromStorage(): void {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) { this.inMemory = []; return; }
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) { this.inMemory = []; return; }
      const filtered = parsed.filter((c) => typeof c === 'string' && isValidCurrency(c));
      this.inMemory = Array.from(new Set(filtered)).slice(0, MAX_ITEMS);
    } catch (e) {
      // malformed JSON or localStorage not available
      this.inMemory = [];
      this.useLocalStorage = false;
    }
  }

  private saveToStorage(): void {
    if (!this.useLocalStorage) { return; }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.inMemory));
    } catch (e) {
      // storage quota or disabled
      this.useLocalStorage = false;
    }
  }

  private init(): void {
    try {
      if (typeof localStorage === 'undefined') { this.useLocalStorage = false; }
    } catch (e) {
      this.useLocalStorage = false;
    }
    this.loadFromStorage();
  }

  list(): string[] {
    return [...this.inMemory];
  }

  isFull(): boolean {
    return this.inMemory.length >= MAX_ITEMS;
  }

  add(code: string): boolean {
    if (!isValidCurrency(code)) { return false; }
    if (this.inMemory.includes(code)) { return false; }
    if (this.inMemory.length >= MAX_ITEMS) { return false; }
    this.inMemory.push(code);
    this.saveToStorage();
    this.notify();
    return true;
  }

  remove(code: string): void {
    const idx = this.inMemory.indexOf(code);
    if (idx === -1) { return; }
    this.inMemory.splice(idx, 1);
    this.saveToStorage();
    this.notify();
  }

  subscribe(cb: Subscriber): () => void {
    this.subscribers.push(cb);
    cb(this.list());
    return () => {
      this.subscribers = this.subscribers.filter((s) => s !== cb);
    };
  }

  private notify(): void {
    const snapshot = this.list();
    this.subscribers.forEach((s) => { try { s(snapshot); } catch (e) { /* ignore */ } });
  }
}

const favorites = new Favorites();

export default favorites;
