declare module "gtts" {
  class gtts {
    constructor(text: string, lang: string);
    save(filepath: string, callback: (err: Error | null) => void): void;
  }
  export = gtts;
}
