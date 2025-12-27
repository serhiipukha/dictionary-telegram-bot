import { Context } from "telegraf";
import { DictionaryService } from "../services/dictionary.service";
import { UserSettingsService } from "../services/user-settings.service";
import { ResponseFormatter } from "../utils/formatter";
import { MESSAGE_TEXT } from "../constants";

export class TextHandler {
  constructor(
    private dictionaryService: DictionaryService,
    private userSettingsService: UserSettingsService,
    private formatter: ResponseFormatter
  ) {}

  async handle(ctx: Context): Promise<void> {
    if (!ctx.from || !("text" in ctx.message!)) {
      return;
    }

    const text = ctx.message.text.trim();
    const userId = ctx.from.id;

    // Send processing message
    const processingMsg = await ctx.reply(MESSAGE_TEXT.PROCESSING);

    try {
      // Get user settings
      const settings = this.userSettingsService.getSettings(userId);

      // Lookup word
      const response = await this.dictionaryService.lookupWord({
        userInput: text,
        targetLanguage: settings.targetLanguage,
      });

      await ctx.deleteMessage(processingMsg.message_id);

      // Format and send response
      switch (response.status) {
        case "success":
          await ctx.reply(this.formatter.formatSuccess(response));
          break;

        case "multiple_words":
          await ctx.reply(this.formatter.formatMultipleWords());
          break;

        case "invalid_word":
          await ctx.reply(this.formatter.formatInvalidWord());
          break;

        case "error":
        default:
          await ctx.reply(this.formatter.formatError());
          break;
      }
    } catch (error) {
      console.error(`[${userId}] Error:`, error);

      await ctx.deleteMessage(processingMsg.message_id).catch(() => {});

      await ctx.reply(MESSAGE_TEXT.ERROR_GENERIC);
    }
  }
}
