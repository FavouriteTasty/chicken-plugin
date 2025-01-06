// src/global.d.ts
export {};

declare global {
  interface Window {
    renderChicken: (containerId: string) => void;
  }
}
