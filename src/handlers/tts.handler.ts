import { Context } from "telegraf";
import { TTSService } from "../services/tts.service";
import { Input } from "telegraf";

export class TTSHandler {
  constructor(private ttsService: TTSService) {}

  async handle(ctx: Context, word: string): Promise<void> {
    if (!ctx.callbackQuery || !("message" in ctx.callbackQuery) || !ctx.callbackQuery.message) {
      return;
    }

    const chatId = ctx.chat!.id;
    const messageId = ctx.callbackQuery.message.message_id;

    try {
      // Remove the button immediately to prevent duplicate clicks
      await Promise.all([
        ctx.answerCbQuery("🔊 Generating audio..."),
        ctx.editMessageReplyMarkup({ inline_keyboard: [] }),
      ]);

      // Generate audio file
      const audioPath = await this.ttsService.generateSpeech(word);

      // Send voice message as a reply to the original message
      await ctx.telegram.sendVoice(chatId, Input.fromLocalFile(audioPath), {
        reply_to_message_id: messageId,
      } as any);

      // Cleanup the temporary file
      await this.ttsService.cleanup(audioPath);
    } catch (error) {
      console.error("Error in TTS handler:", error);
      await ctx.answerCbQuery("❌ Failed to generate audio", {
        show_alert: true,
      }).catch(() => {});
    }
  }
}
