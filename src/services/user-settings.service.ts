import { UserSettings } from "../types";
import { LanguageCode } from "../constants";

export class UserSettingsService {
  private settings: Map<number, UserSettings>;

  constructor() {
    this.settings = new Map();
  }

  getSettings(userId: number): UserSettings {
    if (!this.settings.has(userId)) {
      this.settings.set(userId, {
        targetLanguage: null,
      });
    }
    return this.settings.get(userId)!;
  }

  setTargetLanguage(userId: number, language: LanguageCode | null): void {
    const settings = this.getSettings(userId);
    settings.targetLanguage = language;
    this.settings.set(userId, settings);
  }

  disableTranslation(userId: number): void {
    this.setTargetLanguage(userId, null);
  }
}
