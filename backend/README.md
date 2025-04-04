# Telegram Learning Platform Bot

This bot provides access to the learning platform through a Web App button.

## Setup

1. Create a new bot using [@BotFather](https://t.me/BotFather) on Telegram
2. Copy the bot token provided by BotFather
3. Create a `.env` file in the backend directory with the following content:
   ```
   TELEGRAM_BOT_TOKEN=your_bot_token_here
   WEB_APP_URL=http://localhost:3000  # Change this to your production URL when deploying
   ```
4. Install the required Python packages:
   ```bash
   pip install python-telegram-bot python-dotenv
   ```

## Running the Bot

1. Make sure your React frontend is running (default: http://localhost:3000)
2. Run the bot:
   ```bash
   python bot.py
   ```
3. Open your bot in Telegram and send the `/start` command
4. Click the "Open Learning Platform" button to access the Web App

## Web App Configuration

1. Make sure your React app is configured to work as a Telegram Web App
2. The Web App URL should be accessible from Telegram's servers
3. For development, you can use a service like [ngrok](https://ngrok.com/) to expose your local server

## Production Deployment

1. Update the `WEB_APP_URL` in `.env` to your production URL
2. Deploy the bot to a server that can run 24/7
3. Consider using a process manager like PM2 to keep the bot running

## Available Commands

- `/start` - Start the bot and show the Web App button
- `/help` - Show help information 