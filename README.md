# Dictionary Telegram Bot

A modern Telegram bot providing Cambridge Dictionary-style definitions and translations for English words using OpenAI GPT.

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- Yarn package manager
- Telegram Bot Token (from [@BotFather](https://t.me/BotFather))
- OpenAI API key

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/serhiipukha/dictionary-telegram-bot.git
   cd dictionary-telegram-bot
   ```

2. **Install dependencies**

   ```bash
   yarn install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:

   ```bash
   cp .env.example .env
   ```

   Add your credentials:

   ```env
   TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
   OPENAI_API_KEY=your_openai_api_key_here
   ```

4. **Run the development server**

   ```bash
   yarn dev
   ```

5. **Start using the bot**

   Open Telegram and send `/start` to your bot

## Tech Stack

- **Bot Framework:** [Telegraf 4.16](https://telegraf.js.org/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **AI Integration:** [OpenAI API](https://platform.openai.com/) (GPT-4o-mini)
- **Runtime:** Node.js with ts-node-dev
- **Code Quality:**
  - ESLint 9 with flat config
  - Prettier for formatting
  - TypeScript strict mode

## Available Scripts

```bash
# Development
yarn dev          # Start bot with hot reload

# Production
yarn build        # Compile TypeScript to JavaScript
yarn start        # Run compiled bot

# Code Quality
yarn lint         # Run ESLint
yarn format       # Format code with Prettier
```

## Features

- 📚 Cambridge Dictionary-style definitions
- 🌐 Translation support for 17 languages
- 🎯 Handles words, phrases, and phrasal verbs
- 📝 IPA phonetic transcriptions
- 💡 Example sentences with translations
- ⚙️ Per-user language preferences
- 🔄 Enable/disable translation anytime

## API Configuration

The application uses OpenAI's GPT-4o-mini model with the following configuration:

- **Model:** `gpt-4o-mini`
- **Temperature:** `0.3`
- **Max Tokens:** `2048`
- **Prompt:** See [src/prompts/dictionary.md](src/prompts/dictionary.md) for the full AI prompt template

## License

This project is licensed under the MIT License.
