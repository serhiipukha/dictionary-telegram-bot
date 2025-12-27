export type DictionaryStatus =
  | "success"
  | "multiple_words"
  | "invalid_word"
  | "error";

export interface DictionaryEntry {
  normalized: string | null;
  partOfSpeech: string | null;
  ipa: string | null;
  englishDefinition: string | null;
  englishExamples: string[];
}

export interface Translation {
  targetLanguage: string | null;
  translatedWord: string | null;
  translatedDefinition: string | null;
  translatedExamples: string[];
}

export interface DictionaryResponse {
  input: string;
  status: DictionaryStatus;
  entry: DictionaryEntry;
  translation: Translation;
}

export interface DictionaryRequestParams {
  userInput: string;
  targetLanguage: string | null;
}

export interface UserSettings {
  targetLanguage: string | null;
}
