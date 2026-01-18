import gtts from "gtts";
import { promisify } from "util";
import { unlink } from "fs/promises";
import { join } from "path";
import { randomBytes } from "crypto";

export class TTSService {
  private tempDir: string;

  constructor() {
    this.tempDir = join(__dirname, "../../temp");
  }

  /**
   * Generate audio file from text
   * @param text Text to convert to speech
   * @returns Path to generated audio file
   */
  async generateSpeech(text: string): Promise<string> {
    const filename = `tts_${randomBytes(8).toString("hex")}.mp3`;
    const filePath = join(this.tempDir, filename);

    const speech = new gtts(text, "en");
    const save = promisify(speech.save.bind(speech));

    await save(filePath);

    return filePath;
  }

  /**
   * Delete temporary audio file
   * @param filePath Path to file to delete
   */
  async cleanup(filePath: string): Promise<void> {
    try {
      await unlink(filePath);
    } catch (error) {
      console.error("Failed to cleanup TTS file:", error);
    }
  }
}
