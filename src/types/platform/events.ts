export interface GtagEvent {
  event_category?: string;
  event_label?: string;
  value?: number;
}

declare global {
  interface Window {
    gtag?: (command: string, eventName: string, config?: GtagEvent) => void;
  }
}