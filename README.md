# Shams Academy Inventors School - Telegram Web App

A modern educational platform accessible through Telegram, providing course content, video lessons, and interactive tests.

## Project Structure

```
shams-academy/
├── frontend/           # React Web App
├── backend/           # Django REST API
└── README.md
```

## Features

- Telegram Web App integration
- Course management and video lessons
- Interactive tests and progress tracking
- Secure payment integration (Payme, Click, Uzum Bank)
- Mobile-first responsive design
- User authentication via Telegram

## Prerequisites

- Node.js (v16+)
- Python (v3.8+)
- PostgreSQL
- Telegram Bot Token

## Setup Instructions

### Backend Setup

1. Create and activate virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
cd backend
pip install -r requirements.txt
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Run migrations:
```bash
python manage.py migrate
```

5. Start development server:
```bash
python manage.py runserver
```

### Frontend Setup

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Start development server:
```bash
npm start
```

## Environment Variables

### Backend (.env)
```
DEBUG=True
SECRET_KEY=your_secret_key
DATABASE_URL=postgres://user:password@localhost:5432/shams_academy
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_TELEGRAM_BOT_TOKEN=your_telegram_bot_token
```

## API Documentation

The API documentation will be available at `/api/docs/` when the backend server is running.

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.