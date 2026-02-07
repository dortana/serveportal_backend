import "express-serve-static-core";

declare module "express-serve-static-core" {
  interface Response {
    status(code: number): this;
    __(key: string, options?: any): string;
    getLocale(): string;
  }
}
