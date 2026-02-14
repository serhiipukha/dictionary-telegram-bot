import { SupabaseClient } from "@supabase/supabase-js";
import { DictionaryResponse } from "../types";
import { SupabaseService } from "./supabase.service";

export class WordRequestLogger {
  private supabase: SupabaseClient | null;

  constructor(supabaseService: SupabaseService | null) {
    this.supabase = supabaseService?.getClient() ?? null;
  }

  async log(response: DictionaryResponse): Promise<void> {
    if (!this.supabase) return;

    try {
      const { error } = await this.supabase.from("word_requests").insert({
        user_input: response.input,
        status: response.status,
        response_json: response,
      });

      if (error) {
        console.error("Error logging word request:", error);
      }
    } catch (error) {
      console.error("Failed to log word request:", error);
    }
  }
}
