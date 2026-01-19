# Dictionary Telegram Bot

A modern Telegram bot providing Cambridge Dictionary-style definitions, translations, and audio pronunciation for English words using OpenAI GPT.

## Features

- 📚 Cambridge Dictionary-style definitions
- 🔊 Audio pronunciation
- 🌐 Translation support
- 🎯 Handles words, phrases, and phrasal verbs
- 📝 IPA phonetic transcriptions
- 💡 Example sentences with translations
- 📊 Request/response logging for AI evaluation
- ⚙️ Per-user language preferences
- 🔄 Enable/disable translation anytime

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn package manager
- Telegram Bot Token (from [@BotFather](https://t.me/BotFather))
- OpenAI API key
- Supabase account

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

3. **Set up Supabase database**

   - Create a Supabase project at [supabase.com](https://supabase.com)
   - Run the SQL from [docs/SUPABASE_SETUP.md](docs/SUPABASE_SETUP.md)
   - Get your Project URL and anon key from Project Settings → API

4. **Set up environment variables**

   Create a `.env` file in the root directory:

   ```bash
   cp .env.example .env
   ```

   Add your credentials:

   ```env
   TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
   OPENAI_API_KEY=your_openai_api_key_here
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_KEY=your_supabase_anon_key
   ```

5. **Run the development server**

   ```bash
   yarn dev
   ```

5. **Start using the bot**

   Open Telegram and send `/start` to your bot

## Tech Stack

- **Bot Framework:** [Telegraf 4.16](https://telegraf.js.org/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **AI Integration:** [OpenAI API](https://platform.openai.com/) (GPT-4o-mini)
- **Database:** [Supabase](https://supabase.com/) (PostgreSQL)
- **TTS:** [gTTS](https://www.npmjs.com/package/gtts) (Google Text-to-Speech)
- **Runtime:** Node.js with nodemon + ts-node
- **Code Quality:**
  - ESLint 9 with flat config
  - Prettier for formatting
  - TypeScript strict mode

## Available Scripts

```bash
# Development
npm run dev       # Start bot with hot reload

# Production
npm run build     # Compile TypeScript to JavaScript
npm start         # Run compiled bot

# Code Quality
npm run lint      # Run ESLint
npm run format    # Format code with Prettier
```

## Bot Commands

- `/start` - Welcome message
- `/help` - Show help information
- `/language` - Select translation language
- Send any English word/phrase to get definition + translation
- Click "🔊 Pronounce" button to hear the word

## Architecture

### Services
- **DictionaryService** - OpenAI integration for definitions
- **SupabaseService** - Database client wrapper
- **UserSettingsService** - Persistent language preferences (with in-memory cache)
- **WordRequestLogger** - Logs all requests for AI evaluation
- **TTSService** - Generates audio files for pronunciation

### Database Schema
- `user_settings` - User language preferences
- `word_requests` - Request/response logs (no user tracking)

## Configuration

### OpenAI
- **Model:** `gpt-4o-mini`
- **Temperature:** `0.3`
- **Max Tokens:** `2048`
- **Prompt:** See [src/prompts/dictionary.md](src/prompts/dictionary.md)

### Text-to-Speech
- **Provider:** Google TTS
- **Language:** English (British)

### Database
- **Provider:** Supabase (PostgreSQL)
- **Setup:** See [docs/SUPABASE_SETUP.md](docs/SUPABASE_SETUP.md)

## Deployment

For production deployment on Railway:

1. Add environment variables in Railway dashboard
2. Set `RAILWAY_PUBLIC_DOMAIN` to enable webhook mode
3. Bot automatically switches from polling to webhooks

## License

This project is licensed under the MIT License.
