import { UserSettings } from "../types";
import { LanguageCode } from "../constants";
import { SupabaseService } from "./supabase.service";

export class UserSettingsService {
  private cache: Map<number, UserSettings>;
  private supabase;

  constructor(supabaseService: SupabaseService) {
    this.cache = new Map();
    this.supabase = supabaseService.getClient();
  }

  async getSettings(userId: number): Promise<UserSettings> {
    if (this.cache.has(userId)) {
      return this.cache.get(userId)!;
    }

    const { data, error } = await this.supabase
      .from("user_settings")
      .select("target_language")
      .eq("user_id", userId)
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116 = row not found, which is fine for new users
      console.error("Error fetching user settings:", error);
    }

    const settings: UserSettings = {
      targetLanguage: data?.target_language || null,
    };

    this.cache.set(userId, settings);

    return settings;
  }

  async setTargetLanguage(
    userId: number,
    language: LanguageCode | null
  ): Promise<void> {
    const { error } = await this.supabase
      .from("user_settings")
      .upsert(
        {
          user_id: userId,
          target_language: language,
        },
        {
          onConflict: "user_id",
        }
      );

    if (error) {
      console.error("Error saving user settings:", error);
      throw error;
    }

    const settings = await this.getSettings(userId);
    settings.targetLanguage = language;
    this.cache.set(userId, settings);
  }

  async disableTranslation(userId: number): Promise<void> {
    await this.setTargetLanguage(userId, null);
  }
}
