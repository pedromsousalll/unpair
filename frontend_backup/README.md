# UNPAIR - Sneaker Marketplace App

**UNPAIR** is a mobile-first marketplace for buying and selling single sneakers (left or right foot). Built with Expo (React Native), Firebase, and Gluestack-UI.

## Features

- **Firebase Authentication**: Email/password login and registration
- **Sell Sneakers**: Post individual left or right sneakers with photos
- **Search Requests**: Post what you're looking for
- **Real-time Notifications**: Get notified when matches are found
- **Profile Management**: View your listings and requests
- **Cross-Platform**: Runs on iOS, Android, and Web

## Tech Stack

- **Frontend**: Expo (React Native), React Navigation, Gluestack-UI
- **Backend**: Firebase (Auth, Firestore, Storage)
- **State Management**: React Context API
- **Image Handling**: expo-image-picker, Firebase Storage

## Quick Start

### 1. Install Dependencies

```bash
cd frontend
yarn install
```

### 2. Start the App

```bash
yarn start
```

This will start the Expo development server with a QR code.

### 3. Run on Device/Simulator

**Mobile (Expo Go):**
- Install "Expo Go" app on iOS or Android
- Scan the QR code to open the app

**Web:**
```bash
yarn web
```

## Project Structure

```
frontend/
├── app/
│   ├── (auth)/           # Login & Register
│   ├── (tabs)/           # Home, Sell, Search, Profile
│   ├── config/           # Firebase configuration
│   └── contexts/         # Auth context
```

## Firebase Setup

Firebase credentials are pre-configured. For production, update the Firebase rules:

### Firestore Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /sneakers/{sneakerId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow delete: if request.auth.uid == resource.data.userId;
    }
    match /searchRequests/{requestId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow delete: if request.auth.uid == resource.data.userId;
    }
  }
}
```

### Storage Rules
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /sneakers/{userId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth.uid == userId;
    }
  }
}
```

## Features

### Authentication
- Email/password registration and login
- Persistent sessions

### Sell Screen
- Choose left/right foot
- Add photos from camera or gallery
- Automatic buyer matching

### Search Screen
- Post what you're looking for
- Get notified when matches appear

### Home Feed
- Browse all available sneakers
- Pull-to-refresh

### Profile
- Manage your listings
- Manage search requests
- Logout

## Troubleshooting

```bash
# Clear cache
rm -rf .expo .metro-cache
yarn start --clear
```

## License

MIT
