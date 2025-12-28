import OpenAI from "openai";
import { readFileSync } from "fs";
import { join } from "path";
import { config } from "../config";
import { DictionaryResponse, DictionaryRequestParams } from "../types";
import { SUPPORTED_LANGUAGES, LanguageCode } from "../constants";

export class DictionaryService {
  private openai: OpenAI;
  private systemPrompt: string;

  constructor() {
    this.openai = new OpenAI({
      apiKey: config.openai.apiKey,
    });

    const promptPath = join(__dirname, "../prompts/dictionary.md");
    this.systemPrompt = readFileSync(promptPath, "utf-8");
  }

  private buildUserPrompt(
    userInput: string,
    targetLanguage: string | null
  ): string {
    // Convert language code to full language name
    let languageForPrompt: string | null = targetLanguage;
    if (targetLanguage && targetLanguage in SUPPORTED_LANGUAGES) {
      languageForPrompt = SUPPORTED_LANGUAGES[targetLanguage as LanguageCode];
    }

    return `User input: ${userInput}
Target language: ${languageForPrompt || "null"}`;
  }

  async lookupWord(
    params: DictionaryRequestParams
  ): Promise<DictionaryResponse> {
    try {
      const userPrompt = this.buildUserPrompt(
        params.userInput,
        params.targetLanguage
      );

      const completion = await this.openai.chat.completions.create({
        model: config.openai.model,
        messages: [
          {
            role: "system",
            content: this.systemPrompt,
          },
          {
            role: "user",
            content: userPrompt,
          },
        ],
        response_format: { type: "json_object" },
        temperature: config.openai.temperature,
        max_tokens: config.openai.maxTokens,
      });

      const content = completion.choices[0]?.message?.content;

      if (!content) {
        throw new Error("Empty response from OpenAI");
      }

      const response: DictionaryResponse = JSON.parse(content);

      if (!this.isValidResponse(response)) {
        throw new Error("Invalid response structure from OpenAI");
      }

      return response;
    } catch (error) {
      console.error("Error in DictionaryService.lookupWord:", error);

      return {
        input: params.userInput,
        status: "error",
        entry: {
          normalized: null,
          partOfSpeech: null,
          ipa: null,
          englishDefinition: null,
          englishExamples: [],
        },
        translation: {
          targetLanguage: params.targetLanguage,
          translatedWord: null,
          translatedDefinition: null,
          translatedExamples: [],
        },
      };
    }
  }

  private isValidResponse(response: unknown): response is DictionaryResponse {
    if (typeof response !== "object" || response === null) {
      return false;
    }

    const r = response as Record<string, unknown>;

    return (
      typeof r.input === "string" &&
      typeof r.status === "string" &&
      ["success", "multiple_words", "invalid_word", "error"].includes(
        r.status as string
      ) &&
      typeof r.entry === "object" &&
      r.entry !== null &&
      typeof r.translation === "object" &&
      r.translation !== null
    );
  }
}
