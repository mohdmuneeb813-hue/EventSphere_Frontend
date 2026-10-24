import '@testing-library/jest-dom';

// Mock BroadcastChannel for test environment if not present
if (typeof window !== 'undefined' && !window.BroadcastChannel) {
  window.BroadcastChannel = class {
    constructor(name) {
      this.name = name;
    }
    postMessage() {}
    close() {}
    addEventListener() {}
    removeEventListener() {}
  };
}

// Mock ResizeObserver
if (typeof window !== 'undefined' && !window.ResizeObserver) {
  window.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}
