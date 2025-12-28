import { Telegraf } from "telegraf";
import { message } from "telegraf/filters";
import { config } from "./config";
import { DictionaryService } from "./services/dictionary.service";
import { UserSettingsService } from "./services/user-settings.service";
import { ResponseFormatter } from "./utils/formatter";
import { TextHandler } from "./handlers/text.handler";
import { LanguageHandler } from "./handlers/language.handler";
import { MESSAGE_TEXT, LANGUAGE_CALLBACK_PREFIX } from "./constants";

// Initialize services
const dictionaryService = new DictionaryService();
const userSettingsService = new UserSettingsService();
const formatter = new ResponseFormatter();

// Initialize handlers
const textHandler = new TextHandler(
  dictionaryService,
  userSettingsService,
  formatter
);
const languageHandler = new LanguageHandler(userSettingsService);

// Create bot instance
const bot = new Telegraf(config.telegram.botToken);

// Error handling middleware
bot.catch((err, ctx) => {
  console.error(`Error for ${ctx.updateType}:`, err);
  ctx.reply(MESSAGE_TEXT.ERROR_GENERIC).catch(console.error);
});

// /start command
bot.start(async ctx => {
  await ctx.reply(MESSAGE_TEXT.WELCOME);
});

// /help command
bot.command("help", async ctx => {
  await ctx.reply(MESSAGE_TEXT.HELP);
});

// /language command - show language selection
bot.command("language", async ctx => {
  await languageHandler.showLanguageSelection(ctx);
});

// Handle callback queries (inline keyboard buttons)
bot.on("callback_query", async ctx => {
  if (!ctx.callbackQuery || !("data" in ctx.callbackQuery)) return;

  const data = ctx.callbackQuery.data;
  if (!data.startsWith(LANGUAGE_CALLBACK_PREFIX)) return;

  const languageCode = data.substring(LANGUAGE_CALLBACK_PREFIX.length);
  await languageHandler.handleLanguageSelection(ctx, languageCode);
});

// Handle unknown commands
bot.on(message("text"), async (ctx, next) => {
  const text = ctx.message.text;
  if (text.startsWith("/")) {
    await ctx.reply(MESSAGE_TEXT.UNKNOWN_COMMAND);
    return;
  }
  return next();
});

// Handle text messages
bot.on(message("text"), async ctx => {
  await textHandler.handle(ctx);
});

// Launch the bot
const RAILWAY_PUBLIC_DOMAIN = process.env.RAILWAY_PUBLIC_DOMAIN;

if (RAILWAY_PUBLIC_DOMAIN) {
  // Production: use webhooks
  const webhookUrl = `https://${RAILWAY_PUBLIC_DOMAIN}/webhook`;
  bot
    .launch({
      webhook: {
        domain: webhookUrl,
        port: 8080,
      },
      dropPendingUpdates: true,
    })
    .catch(error => {
      console.error("Failed to launch bot:", error);
      process.exit(1);
    });
} else {
  // Development: use polling
  bot
    .launch({
      dropPendingUpdates: true,
    })
    .catch(error => {
      console.error("Failed to launch bot:", error);
      process.exit(1);
    });
}

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
