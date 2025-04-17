export interface IStartServerOptions {
  // Default is true
  notify?: boolean;
  hostUrl?: string;
  appName?: string;
  port?: string;
  // Default is 0, which means no cache
  cache?: string;
  // Default is true
  cors?: boolean;
  serveCommand?: 'quasar serve' | 'vite preview' | string;
  buildCommand?: 'quasar build' | 'vite build' | string;
}
