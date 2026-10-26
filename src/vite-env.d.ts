/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, unknown>;
  export default component;
}
interface TSDocProp {
  name: string;
  type: string;
  optional: boolean;
  comment: string;
}

interface ImportMeta {
  tsdoc: Record<string, TSDocProp[]>;
}
