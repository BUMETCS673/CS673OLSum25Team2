# Story App API & Frontend Documentation

## Frontend Application Routes

The React application includes the following routes:

### Public Routes
- `/` - **Home** - Landing page accessible to all users
- `/about` - **About** - Information about the application
- `/contact` - **Contact** - Contact information and form
- `/login` - **Sign In** - User authentication page
- `/signup` - **Sign Up** - User registration page

### Protected Routes (Authentication Required)
- `/generatestory` - **Story Generator** - Create new stories with custom parameters
- `/mystory` - **My Stories** - View and manage user's saved stories  
- `/settings` - **Settings** - Configure TTS, image, and story preferences

### Authentication Flow
- Unauthenticated users accessing protected routes are redirected to a `LoginRequired` component
- Navigation bar is hidden on login and signup pages
- JWT token stored in context for API authentication

---

# Story Endpoints Documentation

## Authentication Required
All story endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Endpoints

### 1. Generate Story
**POST** `/api/stories/generate/story`

Generates a new story based on character, setting, theme, and age group.

**Request Body:**
```json
{
  "character": "princess",
  "setting": "magical forest",
  "theme": "friendship",
  "ageGroup": "3-5",
  "style": "watercolor",
  "childId": "optional_child_id"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:3000/api/stories/generate/story \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "character": "princess",
    "setting": "magical forest",
    "theme": "friendship"
  }'
```

**Response:**
```json
{
  "success": true,
  "storyId": "story_id",
  "title": "The Princess and the Forest Friends",
  "content": "Once upon a time...",
  "summary": "A story about friendship...",
  "imageDescription": "A beautiful princess in a magical forest...",
  "wordCount": 150,
  "generatedAt": "2025-06-13T10:30:00.000Z",
  "generationTime": 3500,
  "metadata": {
    "character": "princess",
    "setting": "magical forest",
    "theme": "friendship"
  }
}
```

### 2. Generate Image
**POST** `/api/stories/generate/image`

Generates an image for an existing story.

**Request Body:**
```json
{
  "imageDescription": "A beautiful princess in a magical forest with friendly animals",
  "storyId": "story_id_here"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:3000/api/stories/generate/image \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "imageDescription": "A beautiful princess in a magical forest with friendly animals",
    "storyId": "story_id_here"
  }'
```

**Response:**
```json
{
  "success": true,
  "storyId": "story_id",
  "imageUrl": "https://storage.googleapis.com/...",
  "revisedPrompt": "Enhanced image description...",
  "generationTime": 2500,
  "generatedAt": "2025-06-13T10:35:00.000Z"
}
```

### 3. Generate Audio
**POST** `/api/stories/generate/audio`

Generates audio narration for an existing story.

**Request Body:**
```json
{
  "text": "Once upon a time, there was a princess...",
  "storyId": "story_id_here"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:3000/api/stories/generate/audio \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "text": "Once upon a time, there was a princess...",
    "storyId": "story_id_here"
  }'
```

**Response:**
```json
{
  "storyId": "story_id",
  "audioUrl": "https://storage.googleapis.com/...",
  "audioBuffer": "binary_audio_data",
  "generationTime": 4000,
  "generatedAt": "2025-06-13T10:40:00.000Z"
}
```

### 4. Generate Audio Sample
**POST** `/api/stories/generate/audio_sample`

Generates a sample audio with specified voice and model for testing purposes.

**Request Body:**
```json
{
  "try_voice": "alloy",
  "try_model": "tts-1"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:3000/api/stories/generate/audio_sample \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "try_voice": "alloy",
    "try_model": "tts-1"
  }'
```

**Response:**
```json
{
  "audioUrl": "https://storage.googleapis.com/...",
  "voice": "alloy",
  "model": "tts-1"
}
```

### 5. Get User Stories
**GET** `/api/stories`

Retrieves all stories for the authenticated user.

**cURL Example:**
```bash
curl -X GET http://localhost:5500/api/stories \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:**
```json
{
  "response": {
    "success": true,
    "total": 5,
    "stories": [
      {
        "storyId": "story_id_1",
        "title": "The Princess Adventure",
        "content": "Once upon a time...",
        "summary": "A magical story...",
        "imageUrl": "https://storage.googleapis.com/...",
        "audioUrl": "https://storage.googleapis.com/...",
        "createdAt": "2025-06-13T10:00:00.000Z",
        "character": "princess",
        "setting": "magical forest",
        "theme": "friendship",
        "wordCount": 150,
        "isFavorite": false
      }
    ]
  }
}
```

### 6. Get Specific Story
**GET** `/api/stories/:id`

Retrieves a specific story by ID.

**cURL Example:**
```bash
curl -X GET http://localhost:3000/api/stories/story_id_here \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:**
```json
{
  "story": {
    "storyId": "story_id",
    "title": "The Princess Adventure",
    "content": "Once upon a time...",
    "summary": "A magical story...",
    "audioBuffer": "binary_audio_data",
    "imageDescription": "A beautiful princess...",
    "imageDownloadUrl": "https://storage.googleapis.com/...",
    "audioDownloadUrl": "https://storage.googleapis.com/...",
    "metadata": {
      "character": "princess",
      "setting": "magical forest",
      "theme": "friendship"
    },
    "wordCount": 150,
    "imageStyle": "watercolor",
    "isFavorite": false,
    "createdAt": "2025-06-13T10:00:00.000Z"
  }
}
```

### 7. Save Story to Favorites
**PUT** `/api/stories/:id/save`

Updates the favorite status of a story.

**Request Body:**
```json
{
  "isFavorite": true
}
```

**cURL Example:**
```bash
curl -X PUT http://localhost:3000/api/stories/story_id_here/save \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "isFavorite": true
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Story saved to favorites",
  "response": {
    "success": true,
    "total": 5,
    "stories": [
      // Updated list of all user stories
    ]
  }
}
```

### 8. Delete Story
**DELETE** `/api/stories/:id`

Deletes a specific story and its associated files.

**cURL Example:**
```bash
curl -X DELETE http://localhost:3000/api/stories/story_id_here \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "message": "Story deleted successfully",
  "response": {
    "success": true,
    "total": 4,
    "stories": [
      // Updated list of remaining user stories
    ]
  }
}
```

## Frontend Integration

### Authentication Context
The frontend uses React Context for authentication state management:
```javascript
const { user } = useAuthContext();
```

### Protected Route Pattern
```javascript
<Route
  path="/generatestory"
  element={user ? <GenerateStory /> : <LoginRequired pageName="Story Generator" user={user}/>}
/>
```

### API Integration
Frontend components make HTTP requests to the API endpoints using the stored JWT token:
```javascript
// Example API call pattern
const response = await fetch('/api/stories', {
  headers: {
    'Authorization': `Bearer ${user.token}`,
    'Content-Type': 'application/json'
  }
});
```

## Notes

- All API endpoints require authentication via JWT token
- Story generation is asynchronous and may take several seconds
- Images and audio files are stored in Firebase Storage
- Audio generation uses user's TTS settings from parental controls
- Deleted stories also remove associated image and audio files
- Frontend handles authentication state and route protection
- Navigation bar is conditionally rendered based on current route