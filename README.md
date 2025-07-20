# Daily Task Manager

A modern, secure task management application built with Node.js, Express, Firebase, and vanilla JavaScript. Features user authentication, real-time task management, and a beautiful responsive UI.

## 🚀 Features

- **User Authentication**: Secure registration and login with Firebase Auth
- **Task Management**: Create, edit, delete, and mark tasks as complete
- **Smart Filtering**: Filter tasks by status (pending/completed) and date
- **Modern UI**: Beautiful, responsive design with smooth animations
- **Real-time Updates**: Tasks sync with Firebase Firestore
- **Security**: JWT tokens, rate limiting, and secure Firebase rules
- **Progress Tracking**: Visual progress bar and task statistics

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Authentication**: Firebase Auth, JWT
- **Database**: Firebase Firestore (NoSQL)
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Security**: Helmet, CORS, Rate Limiting
- **Environment**: Environment variables for secure configuration

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Firebase project with Authentication and Firestore enabled

## 🚀 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd Daily-Task-Manager
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp env.example .env
   ```

   Edit `.env` file with your Firebase configuration:

   ```env
   # Firebase Configuration
   FIREBASE_API_KEY=your-firebase-api-key
   FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   FIREBASE_APP_ID=your-app-id

   # Server Configuration
   PORT=3000
   NODE_ENV=development

   # JWT Secret for authentication
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   ```

4. **Set up Firebase**

   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication (Email/Password)
   - Enable Firestore Database
   - Generate a service account key:
     - Go to Project Settings > Service Accounts
     - Click "Generate new private key"
     - Save as `firebase/serviceAccountKey.json`
   - Add your Firebase configuration to the `.env` file

5. **Deploy Firebase Rules**

   ```bash
   # Install Firebase CLI if not already installed
   npm install -g firebase-tools

   # Login to Firebase
   firebase login

   # Initialize Firebase (if not already done)
   firebase init

   # Deploy Firestore rules
   firebase deploy --only firestore:rules
   ```

6. **Start the development server**

   ```bash
   npm run dev
   ```

7. **Open your browser**
   Navigate to `http://localhost:3000`

## 📁 Project Structure

```
Daily-Task-Manager/
├── assets/                 # Static assets (images, icons)
├── firebase/              # Firebase configuration and rules
│   ├── firebase.js        # Firebase setup and functions
│   ├── firestore.rules    # Firestore security rules
│   ├── serviceAccountKey.example.json # Service account template
│   └── serviceAccountKey.json # Your service account key (not in git)
├── pages/                 # Frontend pages
│   ├── dashboard/         # Main dashboard
│   ├── login/            # Login page
│   └── register/         # Registration page
├── server.js             # Express server
├── package.json          # Dependencies and scripts
├── env.example           # Environment variables template
└── README.md            # This file
```

## 🔧 Configuration

### Firebase Setup

1. **Authentication**: Enable Email/Password authentication in Firebase Console
2. **Firestore**: Create a Firestore database in test mode initially
3. **Service Account**: Generate and download service account key for server authentication
4. **Security Rules**: Deploy the provided Firestore security rules

### Environment Variables

- `FIREBASE_API_KEY`: Your Firebase API key
- `FIREBASE_AUTH_DOMAIN`: Your Firebase auth domain
- `FIREBASE_PROJECT_ID`: Your Firebase project ID
- `FIREBASE_STORAGE_BUCKET`: Your Firebase storage bucket
- `FIREBASE_MESSAGING_SENDER_ID`: Your Firebase messaging sender ID
- `FIREBASE_APP_ID`: Your Firebase app ID
- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment (development/production)
- `JWT_SECRET`: Secret key for JWT tokens

## 🔒 Security Features

- **Authentication**: Firebase Auth with JWT tokens
- **Rate Limiting**: Express rate limiting to prevent abuse
- **CORS**: Configured for secure cross-origin requests
- **Helmet**: Security headers for Express
- **Input Validation**: Server-side validation for all inputs
- **Firebase Rules**: Secure Firestore and Storage rules

## 🎨 UI Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Modern Gradient**: Beautiful purple gradient background
- **Glass Morphism**: Modern glass-like UI elements
- **Smooth Animations**: CSS transitions and animations
- **Progress Tracking**: Visual progress bar for task completion
- **Task Statistics**: Real-time task count and statistics

## 📱 Usage

1. **Register**: Create a new account with email and password
2. **Login**: Sign in with your credentials
3. **Add Tasks**: Enter task title and optional due date
4. **Manage Tasks**: Mark as complete, edit, or delete tasks
5. **Filter Tasks**: Use filters to view pending, completed, or all tasks
6. **Date Filtering**: Filter tasks by due date (today, this week, overdue)
7. **Logout**: Secure logout functionality

## 🚀 Deployment

### Production Deployment

1. **Set environment variables for production**

   ```env
   NODE_ENV=production
   PORT=3000
   ```

2. **Deploy to your preferred platform**

   - Heroku
   - Vercel
   - DigitalOcean
   - AWS
   - Google Cloud Platform

3. **Update Firebase security rules for production**

### Docker Deployment

```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 🐛 Troubleshooting

### Common Issues

1. **Firebase connection errors**

   - Verify Firebase configuration in `.env`
   - Check Firebase project settings
   - Ensure Firestore is enabled

2. **Authentication issues**

   - Verify Firebase Auth is enabled
   - Check email/password authentication is enabled
   - Clear browser cache and localStorage

3. **CORS errors**

   - Check CORS configuration in server.js
   - Verify allowed origins in production

4. **Rate limiting**
   - Adjust rate limiting settings in server.js
   - Check if requests are being made too frequently

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Firebase for authentication and database services
- Express.js for the backend framework
- Modern CSS techniques for beautiful UI
- Community contributors and feedback

## 📞 Support

If you encounter any issues or have questions:

1. Check the troubleshooting section
2. Review Firebase documentation
3. Open an issue on GitHub
4. Contact the development team

---

**Happy Task Managing! 🎉**
