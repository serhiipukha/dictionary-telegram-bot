import { SupabaseClient } from "@supabase/supabase-js";
import { UserSettings } from "../types";
import { LanguageCode } from "../constants";
import { SupabaseService } from "./supabase.service";

export class UserSettingsService {
  private cache: Map<number, UserSettings>;
  private supabase: SupabaseClient | null;

  constructor(supabaseService: SupabaseService | null) {
    this.cache = new Map();
    this.supabase = supabaseService?.getClient() ?? null;
  }

  async getSettings(userId: number): Promise<UserSettings> {
    if (this.cache.has(userId)) {
      return this.cache.get(userId)!;
    }

    if (this.supabase) {
      try {
        const { data, error } = await this.supabase
          .from("user_settings")
          .select("target_language")
          .eq("user_id", userId)
          .single();

        if (error && error.code !== "PGRST116") {
          console.error("Error fetching user settings:", error);
        }

        if (data?.target_language) {
          const settings: UserSettings = {
            targetLanguage: data.target_language,
          };
          this.cache.set(userId, settings);
          return settings;
        }
      } catch (error) {
        console.error("Failed to fetch user settings:", error);
      }
    }

    const settings: UserSettings = { targetLanguage: null };
    this.cache.set(userId, settings);
    return settings;
  }

  async setTargetLanguage(
    userId: number,
    language: LanguageCode | null
  ): Promise<void> {
    if (this.supabase) {
      try {
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
        }
      } catch (error) {
        console.error("Failed to save user settings:", error);
      }
    }

    const cached = this.cache.get(userId) ?? { targetLanguage: null };
    cached.targetLanguage = language;
    this.cache.set(userId, cached);
  }

  async disableTranslation(userId: number): Promise<void> {
    await this.setTargetLanguage(userId, null);
  }
}
