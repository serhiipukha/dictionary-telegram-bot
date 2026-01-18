import { Context } from "telegraf";
import { TTSService } from "../services/tts.service";
import { Input } from "telegraf";

export class TTSHandler {
  constructor(private ttsService: TTSService) {}

  async handle(ctx: Context, word: string): Promise<void> {
    if (!ctx.callbackQuery || !("message" in ctx.callbackQuery) || !ctx.callbackQuery.message) {
      return;
    }

    const messageId = ctx.callbackQuery.message.message_id;

    try {
      // Answer callback query to remove loading state
      await ctx.answerCbQuery("🔊 Generating audio...");

      // Generate audio file
      const audioPath = await this.ttsService.generateSpeech(word);

      // Send voice message as a reply to the original message
      await ctx.telegram.sendVoice(ctx.chat!.id, Input.fromLocalFile(audioPath), {
        reply_to_message_id: messageId,
      } as any);

      // Cleanup the temporary file
      await this.ttsService.cleanup(audioPath);
    } catch (error) {
      console.error("Error in TTS handler:", error);
      await ctx.answerCbQuery("❌ Failed to generate audio", {
        show_alert: true,
      });
    }
  }
}
