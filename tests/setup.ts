import '@testing-library/jest-dom';

// Mock chrome runtime API for tests
global.chrome = {
  runtime: {
    getURL: (path: string) => `chrome-extension://mock-id/${path}`,
  },
} as any;
