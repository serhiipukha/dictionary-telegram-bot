import "dotenv/config";

const botToken = process.env.TELEGRAM_BOT_TOKEN;
const apiKey = process.env.OPENAI_API_KEY;
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!botToken) {
  throw new Error("Missing TELEGRAM_BOT_TOKEN environment variable");
}

if (!apiKey) {
  throw new Error("Missing OPENAI_API_KEY environment variable");
}

if (!supabaseUrl) {
  throw new Error("Missing SUPABASE_URL environment variable");
}

if (!supabaseKey) {
  throw new Error("Missing SUPABASE_KEY environment variable");
}

export const config = {
  telegram: {
    botToken,
  },
  openai: {
    apiKey,
    model: "gpt-4o-mini",
    temperature: 0.3,
    maxTokens: 2048,
  },
  supabase: {
    url: supabaseUrl,
    key: supabaseKey,
  },
};
