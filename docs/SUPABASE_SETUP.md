# Supabase Setup

## What You Need

This bot uses Supabase to store:
- **User language preferences** - persists across bot restarts
- **Request/response logs** - for evaluating AI performance

### Create Database Tables

Go to your Supabase project → **SQL Editor** → Run this:

```sql
CREATE TABLE user_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id BIGINT UNIQUE NOT NULL,
  target_language VARCHAR(10)
);

CREATE INDEX idx_user_id ON user_settings(user_id);

CREATE TABLE word_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_input TEXT NOT NULL,
  status VARCHAR(20) NOT NULL,
  response_json JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_user_input ON word_requests(user_input);
CREATE INDEX idx_status ON word_requests(status);
CREATE INDEX idx_created_at ON word_requests(created_at DESC);
```
