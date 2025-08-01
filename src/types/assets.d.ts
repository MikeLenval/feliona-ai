/**
 * Asset Type Definitions - Essential Only
 * 🎯 Только то, что РЕАЛЬНО используется в 99% проектов
 */

// === СТИЛИ ===
declare module "*.module.css" {
  const classes: Record<string, string>;
  export default classes;
}

declare module "*.module.scss" {
  const classes: Record<string, string>;
  export default classes;
}

declare module "*.css" {
  const content: string;
  export default content;
}

declare module "*.scss" {
  const content: string;
  export default content;
}

// === ИЗОБРАЖЕНИЯ (ОСНОВНЫЕ) ===
declare module "*.png" {
  const src: string;
  export default src;
}

declare module "*.jpg" {
  const src: string;
  export default src;
}

declare module "*.jpeg" {
  const src: string;
  export default src;
}

declare module "*.webp" {
  const src: string;
  export default src;
}

declare module "*.gif" {
  const src: string;
  export default src;
}

declare module "*.ico" {
  const src: string;
  export default src;
}

// === Next.js IMAGE OPTIMIZATION ===
interface ResponsiveImage {
  src: string;
  width: number;
  height: number;
  blurDataURL?: string;
}

declare module "*.png?responsive" {
  const image: ResponsiveImage;
  export default image;
}

declare module "*.jpg?responsive" {
  const image: ResponsiveImage;
  export default image;
}

// === SVG ===
declare module "*.svg" {
  import React from "react";
  const SVGComponent: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  export default SVGComponent;
}

declare module "*.svg?url" {
  const src: string;
  export default src;
}

// === ВИДЕО (ОСНОВНЫЕ) ===
declare module "*.mp4" {
  const src: string;
  export default src;
}

declare module "*.webm" {
  const src: string;
  export default src;
}

// === АУДИО (ОСНОВНЫЕ) ===
declare module "*.mp3" {
  const src: string;
  export default src;
}

declare module "*.wav" {
  const src: string;
  export default src;
}

declare module "*.ogg" {
  const src: string;
  export default src;
}

// === ШРИФТЫ ===
declare module "*.woff2" {
  const src: string;
  export default src;
}

declare module "*.woff" {
  const src: string;
  export default src;
}

declare module "*.ttf" {
  const src: string;
  export default src;
}

// === 3D МОДЕЛИ (ЕСЛИ НУЖНО) ===
declare module "*.glb" {
  const src: string;
  export default src;
}

declare module "*.gltf" {
  const src: string;
  export default src;
}

// === ДОКУМЕНТЫ ===
declare module "*.pdf" {
  const src: string;
  export default src;
}

// === ДАННЫЕ ===
declare module "*.json" {
  const content: unknown;
  export default content;
}

declare module "*.yaml" {
  const content: unknown;
  export default content;
}

declare module "*.yml" {
  const content: unknown;
  export default content;
}

// === MARKDOWN ===
declare module "*.md" {
  const content: string;
  export default content;
}

declare module "*.mdx" {
  import { ComponentType } from "react";
  const MDXComponent: ComponentType<Record<string, unknown>>;
  export default MDXComponent;
}

// === WEBASSEMBLY ===
declare module "*.wasm" {
  const wasmModule: WebAssembly.Module;
  export default wasmModule;
}

// === PWA ===
declare module "*.webmanifest" {
  interface WebManifest {
    name: string;
    short_name: string;
    start_url: string;
    display: string;
    background_color: string;
    theme_color: string;
    icons: Array<{
      src: string;
      sizes: string;
      type: string;
    }>;
  }
  const manifest: WebManifest;
  export default manifest;
}

// === WORKERS ===
declare module "*?worker" {
  class WebpackWorker extends Worker {
    constructor();
  }
  export default WebpackWorker;
}

// === WEBPACK 5 ASSET MODULES ===
declare module "*?asset/resource" {
  const src: string;
  export default src;
}

declare module "*?asset/inline" {
  const dataUri: string;
  export default dataUri;
}

declare module "*?asset/source" {
  const source: string;
  export default source;
}

/*
 * Все что РЕАЛЬНО нужно в 99% проектов.
 * Остальное добавляйте по мере необходимости.
 */