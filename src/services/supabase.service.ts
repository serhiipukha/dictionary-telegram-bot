import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { config } from "../config";

export class SupabaseService {
  private client: SupabaseClient;

  constructor() {
    this.client = createClient(config.supabase.url, config.supabase.key);
  }

  getClient(): SupabaseClient {
    return this.client;
  }
}
