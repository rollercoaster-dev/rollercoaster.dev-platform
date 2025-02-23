declare module '@nuxt/content' {
  export function queryContent<T = any>(...args: any[]): {
    find: () => Promise<T[]>;
    findOne: () => Promise<T>;
  };
} 