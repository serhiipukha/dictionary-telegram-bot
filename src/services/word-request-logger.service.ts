import { DictionaryResponse } from "../types";
import { SupabaseService } from "./supabase.service";

export class WordRequestLogger {
  private supabase;

  constructor(supabaseService: SupabaseService) {
    this.supabase = supabaseService.getClient();
  }

  async log(response: DictionaryResponse): Promise<void> {
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
