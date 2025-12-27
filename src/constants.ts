export const SUPPORTED_LANGUAGES = {
  uk: "Ukrainian",
  es: "Spanish",
  fr: "French",
  de: "German",
  it: "Italian",
  pl: "Polish",
  pt: "Portuguese",
  ru: "Russian",
  ja: "Japanese",
  zh: "Chinese",
  ko: "Korean",
  ar: "Arabic",
  tr: "Turkish",
  nl: "Dutch",
  sv: "Swedish",
  cs: "Czech",
  ro: "Romanian",
} as const;

export type LanguageCode = keyof typeof SUPPORTED_LANGUAGES;

export const LANGUAGE_CALLBACK_PREFIX = "lang:" as const;
export const LANGUAGE_DISABLE_CODE = "none" as const;

export const LANGUAGE_NAMES = Object.entries(SUPPORTED_LANGUAGES).map(
  ([code, name]) => ({
    code: code as LanguageCode,
    name,
  })
);

export const MESSAGE_TEXT = {
  WELCOME:
    "👋 Hi! I am a dictionary bot.\n" +
    "Send me an English word and I'll explain it to you.\n\n" +
    "To get translations, select your language with /language",
  HELP:
    "📚 Help:\n\n" +
    "- Send me any English word or phrase\n" +
    "- I will provide meaning and examples\n" +
    "- To get translations, select your language in /language",
  PROCESSING: "⏳ Processing... please wait.",
  MULTIPLE_WORDS:
    "⚠️ I detected multiple words in your input.\n" +
    "I can only explain one word or phrase at a time.",
  INVALID_WORD:
    "❌ I couldn't recognize this as a valid English word.\n" +
    "Please check your spelling and try again.",
  ERROR_GENERIC: "❌ Sorry, something went wrong. Please try again.",
  UNKNOWN_COMMAND:
    "Unknown command.\n\n" + "Use /help to see available commands.",
} as const;
