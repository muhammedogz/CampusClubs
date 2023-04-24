/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_PATH: string;
  readonly VITE_BASE_PATH: string;
  readonly VITE_PUBLIC_PATH: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
