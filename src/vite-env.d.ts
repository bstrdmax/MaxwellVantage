
// Fix: The reference to 'vite/client' was causing an error because the type definitions
// could not be found. It has been replaced with a manual definition of ImportMeta and ImportMetaEnv
// to provide correct typings for environment variables throughout the Vite application.
// This resolves all 'import.meta.env' related TypeScript errors.

interface ImportMetaEnv {
  readonly VITE_FIREBASE_API_KEY: string;
  readonly VITE_FIREBASE_AUTH_DOMAIN: string;
  readonly VITE_FIREBASE_PROJECT_ID: string;
  readonly VITE_FIREBASE_STORAGE_BUCKET: string;
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string;
  readonly VITE_FIREBASE_APP_ID: string;
  readonly VITE_PROSPECTS_TABLE_NAME: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
