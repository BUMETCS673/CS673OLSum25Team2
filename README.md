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
- **Authentication**: JWT
- **Hosting**: Netlify (Frontend)

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
# Create .env file in project root
MONGODB_URI=mongodb://mongo:27017/magical_bedtime
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_api_key
NODE_ENV=development
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
- **Local Backend API**: http://localhost:5000
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
my-magical-bedtime/
├── frontend/
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   ├── context/            # React context providers
│   │   ├── pages/              # Main application pages
│   │   └── assets/             # Images, icons, and static files
│   ├── public/                 # Public assets
│   └── Dockerfile              # Frontend container config
├── backend/
│   ├── controllers/            # Request handlers
│   ├── models/                 # Database schemas
│   ├── routes/                 # API route definitions
│   ├── config/                 # Configuration files
│   └── Dockerfile              # Backend container config
├── docker-compose.yml          # Multi-container setup
├── .env                        # Environment variables
└── README.md                   # Project documentation
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Stories
- `GET /api/stories` - Get user stories
- `POST /api/stories/generate` - Generate new story
- `GET /api/stories/:id` - Get specific story
- `DELETE /api/stories/:id` - Delete story

### Children Profiles
- `GET /api/children` - Get child profiles
- `POST /api/children` - Create child profile
- `PUT /api/children/:id` - Update child profile
- `DELETE /api/children/:id` - Delete child profile

## 🎯 Target Audience

This application is designed for:
- **Primary Users**: Children ages 3-5
- **Secondary Users**: Parents and caregivers
- **Use Case**: Bedtime routine enhancement and early literacy development

