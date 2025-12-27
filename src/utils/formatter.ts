import { bold, italic, fmt } from "telegraf/format";
import { FmtString } from "telegraf/format";
import { DictionaryResponse } from "../types";
import { MESSAGE_TEXT } from "../constants";

export class ResponseFormatter {
  formatSuccess(response: DictionaryResponse): FmtString {
    const { entry, translation } = response;

    // Build main word section
    const wordSection = fmt`${bold(entry.normalized || "")} (${italic(entry.partOfSpeech || "")})
${entry.ipa || ""}

  ${bold("Meaning")}
  ${entry.englishDefinition || ""}`;

    // Build examples section if available
    let examplesSection = fmt``;
    if (entry.englishExamples.length > 0) {
      const examplesList = entry.englishExamples
        .map((ex, idx) => `  ${idx + 1}) ${ex}`)
        .join("\n");
      examplesSection = fmt`

  ${bold("Examples")}
${examplesList}`;
    }

    // Build translation section if available
    let translationSection = fmt``;
    if (translation.translatedWord) {
      translationSection = fmt`

  
${bold("Translation")}

  ${bold("Meaning")}
  ${translation.translatedDefinition || ""}`;

      if (translation.translatedExamples.length > 0) {
        const translatedExamplesList = translation.translatedExamples
          .map((ex, idx) => `  ${idx + 1}) ${ex}`)
          .join("\n");
        translationSection = fmt`${translationSection}

  ${bold("Examples")}
${translatedExamplesList}`;
      }
    }

    return fmt`${wordSection}${examplesSection}${translationSection}`;
  }

  formatMultipleWords(): string {
    return MESSAGE_TEXT.MULTIPLE_WORDS;
  }

  formatInvalidWord(): string {
    return MESSAGE_TEXT.INVALID_WORD;
  }

  formatError(): string {
    return MESSAGE_TEXT.ERROR_GENERIC;
  }
}
