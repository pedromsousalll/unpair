# 🔥 Firebase Configuration Guide for UNPAIR

This document provides a complete Firebase setup checklist and configuration guide for the UNPAIR sneaker marketplace app.

## 📋 Current Configuration Status

### ✅ Already Configured
- **Firebase Project**: `unpair98`
- **Firebase SDK**: Initialized in `/app/frontend/app/config/firebase.ts`
- **Authentication Methods**: Email/Password + Google Sign-In
- **Firestore Database**: Basic structure in place
- **Firebase Storage**: Configured for image uploads
- **Platform-specific Auth Persistence**: AsyncStorage (native) / Default (web)

---

## 🔒 Firebase Security Rules (ACTION REQUIRED)

### 1. Firestore Security Rules

**⚠️ CRITICAL**: Your Firestore database currently may be in test mode (allows all reads/writes). You MUST configure proper security rules before production.

#### Navigate to Firebase Console:
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: `unpair98`
3. Click **Firestore Database** → **Rules** tab

#### Apply These Security Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper function: Check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Helper function: Check if user owns the document
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    // Users collection - only user can read/write their own data
    match /users/{userId} {
      allow read: if isAuthenticated();
      allow write: if isOwner(userId);
    }
    
    // Sneakers collection - authenticated users can read all, write their own
    match /sneakers/{sneakerId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated() && request.resource.data.userId == request.auth.uid;
      allow update, delete: if isOwner(resource.data.userId);
    }
    
    // Search Requests - authenticated users can read all, write their own
    match /searchRequests/{requestId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated() && request.resource.data.userId == request.auth.uid;
      allow update, delete: if isOwner(resource.data.userId);
    }
    
    // Notifications - users can only read their own notifications
    match /notifications/{notificationId} {
      allow read: if isAuthenticated() && resource.data.recipientId == request.auth.uid;
      allow create: if isAuthenticated();
      allow delete: if isOwner(resource.data.recipientId);
    }
    
    // Conversations - participants can read/write
    match /conversations/{conversationId} {
      allow read: if isAuthenticated() && request.auth.uid in resource.data.participants;
      allow create: if isAuthenticated() && request.auth.uid in request.resource.data.participants;
      allow update: if isAuthenticated() && request.auth.uid in resource.data.participants;
    }
    
    // Messages - participants of conversation can read/write
    match /messages/{messageId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated() && request.resource.data.senderId == request.auth.uid;
    }
    
    // Reports - authenticated users can create, admins can read all
    match /reports/{reportId} {
      allow create: if isAuthenticated() && request.resource.data.reporterId == request.auth.uid;
      allow read: if isAuthenticated(); // Change this to admin-only in production
    }
  }
}
```

**How to Apply:**
1. Copy the rules above
2. Paste in the Rules editor
3. Click **Publish**

---

### 2. Firebase Storage Rules

#### Navigate to:
Firebase Console → **Storage** → **Rules** tab

#### Apply These Rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    
    // Profile photos - users can upload to their own folder
    match /profile/{userId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId
                   && request.resource.size < 5 * 1024 * 1024  // Max 5MB
                   && request.resource.contentType.matches('image/.*');
    }
    
    // Sneaker images - authenticated users can upload
    match /sneakers/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null
                   && request.resource.size < 10 * 1024 * 1024  // Max 10MB
                   && request.resource.contentType.matches('image/.*');
    }
  }
}
```

**How to Apply:**
1. Copy the rules above
2. Paste in the Rules editor
3. Click **Publish**

---

## 📊 Firestore Indexes (PERFORMANCE OPTIMIZATION)

Your app performs complex queries that require composite indexes. Firebase will prompt you to create these when you first run the queries, but here's the list:

### Required Indexes:

1. **Sneakers Collection**
   - **Fields**: `userId` (Ascending) + `createdAt` (Descending)
   - **Query Scope**: Collection

2. **Messages Collection**
   - **Fields**: `conversationId` (Ascending) + `timestamp` (Ascending)
   - **Query Scope**: Collection

3. **Conversations Collection**
   - **Fields**: `participants` (Array) + `lastMessageAt` (Descending)
   - **Query Scope**: Collection

4. **Notifications Collection**
   - **Fields**: `recipientId` (Ascending) + `createdAt` (Descending)
   - **Query Scope**: Collection

### How to Create Indexes:

**Option 1: Automatic (Recommended)**
- Run the app and perform queries
- Firebase will show error messages with direct links to create required indexes
- Click the link → Index will be auto-created

**Option 2: Manual**
1. Go to Firebase Console → Firestore Database → **Indexes** tab
2. Click **Create Index**
3. Enter Collection ID, Fields, and Sort order as listed above
4. Click **Create**

---

## 🔐 Firebase Authentication Settings

### Email/Password Configuration

1. Go to Firebase Console → **Authentication** → **Sign-in method**
2. Ensure **Email/Password** is **ENABLED**
3. Enable **Email link (passwordless sign-in)** if you want passwordless login (optional)

### Google Sign-In Configuration

Already configured with Web Client ID:
```
803140766783-f7k3uihb66bbogq6a7qva16qr8utjhb6.apps.googleusercontent.com
```

**Additional Steps for Production:**
1. Add authorized domains in Firebase Console → Authentication → Settings → **Authorized domains**
2. Add your production domain (e.g., `unpair.app`)
3. Configure OAuth consent screen in Google Cloud Console

### Email Verification (Optional but Recommended)

Enable email verification for new signups:
1. Go to Authentication → **Templates** → **Email address verification**
2. Customize the email template
3. Add verification check in your app code

---

## 🔔 Firebase Cloud Messaging (Push Notifications)

### Setup Required:

1. **For Android:**
   - Add `google-services.json` to `/app/frontend/android/app/`
   - Already using `expo-notifications` package ✅

2. **For iOS:**
   - Add `GoogleService-Info.plist` to `/app/frontend/ios/`
   - Configure APNs (Apple Push Notification service)
   - Add push notification capability

3. **Register device tokens:**
   - Already handled in `/app/frontend/app/hooks/useNotifications.ts` ✅

---

## 🧪 Test Mode vs Production Mode

### Current Status: Test Mode (Permissive Rules)

### Before Going to Production:
1. ✅ Apply Firestore Security Rules (above)
2. ✅ Apply Storage Security Rules (above)
3. ✅ Create Composite Indexes (above)
4. ⚠️ Enable email verification
5. ⚠️ Set up Firebase Analytics (optional)
6. ⚠️ Configure billing alerts
7. ⚠️ Set up Firebase App Check (bot protection)

---

## 🚀 Firebase App Check (Optional - Bot Protection)

Protect your backend from abuse:

1. Go to Firebase Console → **App Check**
2. Register your app
3. Choose attestation provider:
   - **reCAPTCHA Enterprise** (web)
   - **DeviceCheck** (iOS)
   - **Play Integrity API** (Android)

---

## 📈 Monitoring & Analytics

### Firebase Performance Monitoring

1. Go to Firebase Console → **Performance**
2. Click **Enable**
3. Install SDK (already included in Expo)

### Firebase Analytics

1. Go to Firebase Console → **Analytics**
2. Already auto-enabled with your Firebase config ✅
3. Review events in Analytics dashboard

---

## 🔄 Backup & Disaster Recovery

### Automated Backups (Recommended for Production)

1. Go to Google Cloud Console → **Firestore** → **Backups**
2. Set up scheduled backups
3. Choose backup location (e.g., `us-central1`)
4. Set retention period

### Manual Export

```bash
gcloud firestore export gs://[BUCKET_NAME]/[EXPORT_FOLDER]
```

---

## 🧪 Testing Your Firebase Setup

### Test Checklist:

- [ ] Can register new user with email/password
- [ ] Can login with existing credentials
- [ ] Can sign in with Google
- [ ] Can upload profile photo
- [ ] Can create sneaker listing
- [ ] Can create search request
- [ ] Can send/receive messages
- [ ] Can delete own listings
- [ ] Cannot delete other users' listings (security rule test)
- [ ] Notifications are created on matches

---

## 🛠️ Common Issues & Solutions

### Issue: "Missing or insufficient permissions"
**Solution**: Check Firestore Security Rules are properly configured

### Issue: "Quota exceeded"
**Solution**: 
- Check Firebase Console → Usage tab
- Upgrade to Blaze (pay-as-you-go) plan if needed
- Free tier limits: 50K reads/day, 20K writes/day

### Issue: "Index required" error
**Solution**: Click the error link to auto-create the index, or manually create as listed above

### Issue: Google Sign-In not working on device
**Solution**: 
- Ensure SHA-1 fingerprint is added in Firebase (Android)
- Check authorized domains include your app domain
- Verify `EXPO_PUBLIC_FIREBASE_WEB_CLIENT_ID` is correct

---

## 📝 Environment Variables Checklist

All required env vars are already set in `/app/frontend/.env`:

- ✅ `EXPO_PUBLIC_FIREBASE_API_KEY`
- ✅ `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN`
- ✅ `EXPO_PUBLIC_FIREBASE_PROJECT_ID`
- ✅ `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET`
- ✅ `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- ✅ `EXPO_PUBLIC_FIREBASE_APP_ID`
- ✅ `EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID`
- ✅ `EXPO_PUBLIC_FIREBASE_WEB_CLIENT_ID`

---

## 🎯 Action Items Summary

### HIGH PRIORITY (Do Now):
1. **Apply Firestore Security Rules** (copy from section above)
2. **Apply Storage Security Rules** (copy from section above)
3. **Test authentication flow** on both web and device

### MEDIUM PRIORITY (Before Production Launch):
4. **Create Composite Indexes** (let Firebase auto-suggest or create manually)
5. **Enable Email Verification**
6. **Set up billing alerts**

### LOW PRIORITY (Nice to Have):
7. Set up Firebase App Check
8. Configure automated backups
9. Set up Firebase Performance Monitoring

---

## 📚 Additional Resources

- [Firebase Security Rules Guide](https://firebase.google.com/docs/rules)
- [Firestore Data Modeling Best Practices](https://firebase.google.com/docs/firestore/best-practices)
- [Firebase Pricing Calculator](https://firebase.google.com/pricing)
- [Expo + Firebase Guide](https://docs.expo.dev/guides/using-firebase/)

---

**Last Updated**: June 2025
**Project**: UNPAIR Sneaker Marketplace
**Firebase Project ID**: `unpair98`
