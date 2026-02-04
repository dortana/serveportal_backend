import { AsyncLocalStorage } from "node:async_hooks";

type Translator = (key: string, ...args: any[]) => string;

type Store = {
  t: Translator;
  lang: string;
};

const storage = new AsyncLocalStorage<Store>();

export function runWithI18n(t: Translator, lang: string, fn: () => void) {
  storage.run({ t, lang }, fn);
}

export function getTranslator(): Translator {
  return storage.getStore()?.t ?? ((key: string) => key);
}

export function getCurrentLanguage(): string {
  return storage.getStore()?.lang ?? "en-US";
}
