import { Context, Markup } from "telegraf";
import { UserSettingsService } from "../services/user-settings.service";
import {
  LANGUAGE_NAMES,
  SUPPORTED_LANGUAGES,
  LanguageCode,
  LANGUAGE_CALLBACK_PREFIX,
  LANGUAGE_DISABLE_CODE,
} from "../constants";

export class LanguageHandler {
  constructor(private userSettingsService: UserSettingsService) {}

  async showLanguageSelection(ctx: Context): Promise<void> {
    if (!ctx.from) return;

    const settings = await this.userSettingsService.getSettings(ctx.from.id);

    let message = "🌐 Select translation language:";
    if (settings.targetLanguage) {
      const languageName =
        SUPPORTED_LANGUAGES[settings.targetLanguage as LanguageCode];
      message += `\n\nCurrent language: ${languageName}`;
    }

    // Create inline keyboard with language options (3 per row)
    const buttons = [];
    for (let i = 0; i < LANGUAGE_NAMES.length; i += 3) {
      const row = LANGUAGE_NAMES.slice(i, i + 3).map(lang =>
        Markup.button.callback(
          `${lang.name}`,
          `${LANGUAGE_CALLBACK_PREFIX}${lang.code}`
        )
      );
      buttons.push(row);
    }

    // Add "Disable Translation" button only if translation is enabled
    if (settings.targetLanguage) {
      buttons.push([
        Markup.button.callback(
          "❌ Disable Translation",
          `${LANGUAGE_CALLBACK_PREFIX}${LANGUAGE_DISABLE_CODE}`
        ),
      ]);
    }

    await ctx.reply(message, Markup.inlineKeyboard(buttons));
  }

  async handleLanguageSelection(
    ctx: Context,
    languageCode: string
  ): Promise<void> {
    if (!ctx.from) return;

    // Check if disabling translation
    if (languageCode === LANGUAGE_DISABLE_CODE) {
      await this.userSettingsService.disableTranslation(ctx.from.id);
      await ctx.answerCbQuery();
      await ctx.editMessageText("✅ Translation disabled");
      return;
    }

    // Validate language code against supported languages
    if (!(languageCode in SUPPORTED_LANGUAGES)) {
      await ctx.answerCbQuery("❌ Invalid language");
      return;
    }

    const languageName = SUPPORTED_LANGUAGES[languageCode as LanguageCode];
    await this.userSettingsService.setTargetLanguage(
      ctx.from.id,
      languageCode as LanguageCode
    );

    await ctx.answerCbQuery();
    await ctx.editMessageText(`✅ Translation language set to ${languageName}`);
  }
}
