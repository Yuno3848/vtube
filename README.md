# VTube - Video Streaming Platform (Backend)

A full-featured video streaming platform built with Node.js, Express, and MongoDB. VTube allows users to upload, share, and discover videos with social features like comments, likes, subscriptions, and playlists.

## 🚀 Features

- **Video Management**: Upload, stream, and manage videos
- **User Authentication**: Secure registration and login system
- **Social Features**: 
  - Like/dislike videos
  - Comment system
  - User subscriptions
  - Personal playlists
- **Dashboard**: User analytics and content management
- **Tweet Integration**: Social media-like short content sharing
- **Cloud Storage**: Video and image storage via Cloudinary
- **Responsive Design**: Works across all devices

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Cloud Storage**: Cloudinary
- **Authentication**: JWT tokens
- **File Upload**: Multer middleware
- **Validation**: Custom validator middleware

## 📁 Project Structure

```
vtube/
├── controllers/
│   ├── comment.controllers.js
│   ├── dashboard.controllers.js
│   ├── like.controllers.js
│   ├── playlist.controllers.js
│   ├── subscription.controllers.js
│   ├── tweet.controllers.js
│   ├── user.controllers.js
│   └── video.controllers.js
├── middlewares/
│   ├── auth.middlewares.js
│   ├── multer.middlewares.js
│   └── validator.middlewares.js
├── models/
│   ├── comment.models.js
│   ├── like.models.js
│   ├── playlist.models.js
│   ├── subscription.models.js
│   ├── tweet.models.js
│   ├── user.models.js
│   └── video.models.js
├── routes/
│   ├── comment.routes.js
│   ├── like.routes.js
│   ├── playlist.routes.js
│   ├── tweet.routes.js
│   ├── user.routes.js
│   └── video.routes.js
├── utils/
│   ├── ApiError.js
│   ├── ApiResponse.js
│   ├── asyncHandler.js
│   ├── cloudinary.js
│   └── index.js
└── validator/
    └── validator.js
```

## ⚙️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB database
- Cloudinary account for media storage

### 1. Clone the repository
```bash
git clone https://github.com/Yuno3848/vtube.git
cd vtube
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory with the following variables:

```env
MONGO_URL=your_mongodb_connection_string
BASE_ORIGIN=http://localhost:8080
PORT=8080
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET_KEY=your_cloudinary_secret_key
ACCESS_TOKEN_EXPIRY=24h
SECRET_KEY=your_jwt_secret_key
```

### 4. Start the application
```bash
# Development mode
npm run dev

# Production mode
npm start
```

The application will be available at `http://localhost:8080`

## 📋 API Endpoints

### Authentication
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login
- `POST /api/users/logout` - User logout
- `POST /api/users/refresh-token` - Refresh access token

### Video Management
- `GET /api/videos` - Get all videos
- `POST /api/videos` - Upload a new video
- `GET /api/videos/:id` - Get video by ID
- `PUT /api/videos/:id` - Update video details
- `DELETE /api/videos/:id` - Delete video

### User Interactions
- `POST /api/likes/toggle/:videoId` - Toggle like on video
- `POST /api/comments` - Add comment to video
- `GET /api/comments/:videoId` - Get video comments
- `POST /api/subscriptions/toggle/:channelId` - Toggle subscription

### Playlists
- `GET /api/playlists` - Get user playlists
- `POST /api/playlists` - Create new playlist
- `PUT /api/playlists/:id` - Update playlist
- `DELETE /api/playlists/:id` - Delete playlist

### Dashboard
- `GET /api/dashboard/stats` - Get user statistics
- `GET /api/dashboard/videos` - Get user's videos

## 🔧 Key Features Implementation

### File Upload
Uses Multer middleware for handling video and image uploads, with Cloudinary integration for cloud storage.

### Authentication
JWT-based authentication with refresh tokens for secure user sessions.

### Data Validation
Custom validator middleware ensures data integrity across all endpoints.

### Error Handling
Centralized error handling with custom ApiError and ApiResponse utilities.

### Async Operations
Proper async/await implementation with error handling using asyncHandler utility.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🐛 Bug Reports & Feature Requests

If you encounter any bugs or have feature requests, please create an issue in the [GitHub Issues](https://github.com/Yuno3848/vtube/issues) section.

## 📞 Contact

- GitHub: [@Yuno3848](https://github.com/Yuno3848)
- Project Link: [https://github.com/Yuno3848/vtube](https://github.com/Yuno3848/vtube)



⭐ If you found this project helpful, please give it a star on GitHub!
