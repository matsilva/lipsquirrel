type Listener<T> = (value: T) => void;

export class Mug<T extends object> {
  private state: Partial<T>; // The global state object
  private listeners: { [K in keyof T]?: Record<number, Listener<T[K]>> }; // Key-value store for listeners
  private listenerIdCounter: number;

  constructor(initialState?: Partial<T>) {
    this.state = initialState || {};
    this.listeners = {} as { [K in keyof T]?: Record<number, Listener<T[K]>> };
    this.listenerIdCounter = 0;
  }

  // Get the value of a state property
  getState<K extends keyof T>(key: K): T[K] | undefined {
    return this.state[key];
  }

  // Set the value of a state property and notify listeners
  setState<K extends keyof T>(key: K, value: T[K]): void {
    this.state[key] = value;
    // Notify listeners for this key
    if (this.listeners[key]) {
      Object.values(this.listeners[key]).forEach((listener) => listener(value));
    }
  }

  // Subscribe to changes on a specific state key
  subscribe<K extends keyof T>(key: K, listener: Listener<T[K]>): () => void {
    if (!this.listeners[key]) {
      this.listeners[key] = {};
    }

    const id = ++this.listenerIdCounter;
    this.listeners[key][id] = listener;

    // Return an unsubscribe function to remove the listener by ID
    return () => {
      if (this.listeners[key] && this.listeners[key][id]) {
        delete this.listeners[key][id];
      }
    };
  }
}
