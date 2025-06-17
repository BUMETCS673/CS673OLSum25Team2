# My Magical Bedtime 🌙📚

An AI-powered bedtime story generator designed specifically for preschool children (ages 3-5) that creates personalized, educational stories while supporting early childhood development.

## 🌟 Live Demo

**Try it now:** [https://velvety-entremet-8ac832.netlify.app/](https://velvety-entremet-8ac832.netlify.app/)

## ✨ Features

- 🎨 **Personalized Stories** - AI-generated tales customized for each child
- 🔊 **Audio Narration** - Read-along feature with text highlighting
- 👨‍👩‍👧‍👦 **Parental Controls** - Content filtering and safety settings
- 📚 **Story Library** - Save and revisit favorite stories
- 🎯 **Age-Appropriate** - Content specifically designed for preschoolers
- 📱 **Child-Friendly UI** - Simple, colorful interface for young users

## 🛠️ Tech Stack

- **Frontend**: React, Vite
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **AI Integration**: OpenAI GPT API
- **Authentication**: JWT, Google OAuth
- **Hosting**: Netlify (Frontend), Heroku (Backend)


## 🚀 Getting Started

### Prerequisites
- Docker
- Docker Compose
- OpenAI API key

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/BUMETCS673/CS673OLSum25Team2.git
cd code
```

2. **Set up environment variables**
```bash
# code/frontend/.env
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
```

```bash
# code/backend/.env
PORT=5500
NODE_ENV=development
MONGO_URI=your_mongodb_atlas_connection_string
SECRET=your_jwt_secret_here
OPENAI_API_KEY=your_openai_api_key_here
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_firebase_app_id
```

3. **Start the application with Docker**
```bash
# Build and run all services
docker-compose up --build

# Run in detached mode
docker-compose up -d
```

4. **Access the application**
- **Production**: https://velvety-entremet-8ac832.netlify.app/
- **Local Frontend**: http://localhost:5173
- **Local Backend API**: http://localhost:5500
- **MongoDB**: localhost:27017

### 🐳 Docker Commands

```bash
# Stop all services
docker-compose down

# View logs
docker-compose logs

# View logs for specific service
docker-compose logs frontend
docker-compose logs backend

# Rebuild specific service
docker-compose build frontend
docker-compose build backend

# Clean up containers and images
docker-compose down --rmi all --volumes --remove-orphans
```

## 📁 Project Structure

```
code/
├── frontend/
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── context/            # React context providers
│   │   ├── pages/              # Main application pages
│   │   └── assets/             # Images, icons, and static files
│   ├── public/                 # Public assets
│   ├── .env                    # Frontend environment variables
│   └── Dockerfile              # Frontend container config
├── backend/
│   ├── controllers/            # Request handlers
│   ├── models/                 # Database schemas
│   ├── routes/                 # API route definitions
│   ├── config/                 # Configuration files
│   ├── .env                    # Backend environment variables
│   └── Dockerfile              # Backend container config
├── docker-compose.yml          # Multi-container setup
└── README.md                   # Project documentation              
```

## 🔌 API Endpoints


# API Endpoints

## Authentication
* `POST /api/auth/login` - User login
* `POST /api/auth/signup` - User registration
* `POST /api/auth/logout` - User logout


## Stories
* `GET /api/stories` - Get user stories
* `POST /api/stories/generate/story` - Generate new story
* `POST /api/stories/generate/image` - Generate story image
* `POST /api/stories/generate/audio` - Generate story audio
* `POST /api/stories/generate/audio_sample` - Generate audio sample
* `GET /api/stories/:id` - Get specific story
* `PUT /api/stories/:id/save` - Save story to favorites
* `DELETE /api/stories/:id` - Delete story

## Settings
* `GET /api/settings` - Get user settings
* `GET /api/settings/enums` - Get settings enums/options
* `PUT /api/settings/update` - Update user settings

**Note:** All story and settings endpoints require authentication.


## 🎯 Target Audience

This application is designed for:
- **Primary Users**: Children ages 3-5
- **Secondary Users**: Parents and caregivers
- **Use Case**: Bedtime routine enhancement and early literacy development

