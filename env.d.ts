/// <reference types="vite/client" />

// Memberitahu TypeScript bahwa file .vue adalah komponen Vue yang valid
// dan memiliki default export — tanpa ini TS tidak bisa resolve import .vue
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, unknown>
  export default component
}
