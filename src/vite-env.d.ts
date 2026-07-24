/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CONTROL_PLANE_URL?: string;
  readonly VITE_BUCKET_SERVICE_URL?: string;
  readonly VITE_BUCKET_URL?: string;
  readonly VITE_PRANA_SERVICE_URL?: string;
  readonly VITE_PRANA_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
