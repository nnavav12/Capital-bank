/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly EMAIL_JS_SERVICE_ID?: string;
  readonly EMAIL_JS_TEMPLATE_ID?: string;
  readonly EMAIL_JS_PUBLIC_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
