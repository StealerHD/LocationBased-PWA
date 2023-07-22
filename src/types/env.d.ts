declare global {
    namespace NodeJS {
      interface ProcessEnv {
        NODE_ENV: 'development' | 'production' | 'test';
        // you can add as many more as you like
        // [key: string]: string | undefined;
      }
    }
  }
  