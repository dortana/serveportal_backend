import "express";

declare module "express" {
  interface Response {
    __?: (key: string) => string;
    getLocale?: () => string;
  }
}
