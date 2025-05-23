# My Magical Bedtime 🌙📚

An AI-powered bedtime story generator designed specifically for preschool children (ages 3-5) that creates personalized, educational stories while supporting early childhood development.

## Features

- 🎨 **Personalized Stories** - AI-generated tales customized for each child
- 🔊 **Audio Narration** - Read-along feature with text highlighting
- 👨‍👩‍👧‍👦 **Parental Controls** - Content filtering and safety settings
- 📚 **Story Library** - Save and revisit favorite stories
- 🎯 **Age-Appropriate** - Content specifically designed for preschoolers
- 📱 **Child-Friendly UI** - Simple, colorful interface for young users

## Tech Stack

- **Frontend**: React, Vite
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **AI Integration**: OpenAI GPT API
- **Authentication**: JWT

## Getting Started

### Prerequisites
- Docker
- Docker Compose
- OpenAI API key

### Installation

1. Clone the repository
```bash
git clone https://github.com/BUMETCS673/CS673OLSum25Team2.git
cd code
```

2. Set up environment variables
```bash
# Create .env file in project root
MONGODB_URI=mongodb://mongo:27017/magical_bedtime
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_api_key
NODE_ENV=development
```

3. Start the application with Docker
```bash
# Build and run all services
docker-compose up --build

# Run in detached mode
docker-compose up -d
```

4. Access the application
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- MongoDB: localhost:27017

### Docker Commands

```bash
# Stop all services
docker-compose down

# View logs
docker-compose logs

# Rebuild specific service
docker-compose build frontend
docker-compose build backend
```

## Project Structure

```
my-magical-bedtime/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── assets/
│   ├── public/
│   └── Dockerfile
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── config/
│   └── Dockerfile
├── docker-compose.yml
├── .env
└── README.md
```

## API Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/stories` - Get user stories
- `POST /api/stories/generate` - Generate new story
- `GET /api/children` - Get child profiles
- `POST /api/children` - Create child profile
