# 📱 Real Device Testing Guide for UNPAIR

This guide provides step-by-step instructions for testing the UNPAIR app on your physical mobile device.

## 🚀 Quick Start - Test on Your Device RIGHT NOW

### Method 1: Expo Go App (Fastest - 2 Minutes) ⚡

This is the **easiest and fastest way** to test your app on a real device without any build process.

#### Step 1: Install Expo Go App

**On iOS:**
1. Open App Store
2. Search for "Expo Go"
3. Install the app
4. Open Expo Go

**On Android:**
1. Open Google Play Store
2. Search for "Expo Go"
3. Install the app
4. Open Expo Go

#### Step 2: Get Your QR Code

The app is already running and generating a QR code! Here's how to find it:

1. **Check your terminal/console** where the app is running
2. Look for output that says: `Tunnel ready.`
3. You'll see a URL like: `exp://unpair-sneakers.preview.emergentagent.com`
4. **Generate QR Code from URL:**

   Visit this link in your browser to see the QR code:
   ```
   https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=exp://unpair-sneakers.preview.emergentagent.com
   ```

   Or use this command to get it:
   ```bash
   npx expo start --tunnel
   ```

#### Step 3: Scan QR Code & Test

**On iOS:**
1. Open the **Camera** app (not Expo Go)
2. Point at the QR code
3. Tap the notification that appears
4. App will open in Expo Go

**On Android:**
1. Open **Expo Go** app
2. Tap "Scan QR Code"
3. Point at the QR code
4. App will load automatically

#### Step 4: Live Testing

✅ **Hot Reload is Enabled!** - Any code changes you make will instantly appear on your device!

**Test Checklist:**
- [ ] Animated splash screen appears (skateboard animation)
- [ ] Can register with email/password
- [ ] Can login with email/password
- [ ] Google Sign-In works
- [ ] Can browse sneaker listings on home
- [ ] Can upload and post a sneaker listing
- [ ] Can create search request
- [ ] Can view profile
- [ ] Can upload profile photo
- [ ] Dark mode toggle works
- [ ] Logout works (should show modal)
- [ ] Messaging/chat works

---

## 📋 Current QR Code Access

Your app is accessible at:
```
Tunnel URL: exp://unpair-sneakers.preview.emergentagent.com
```

**To get QR code:**

**Option A: Online QR Generator**
```
https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=exp://unpair-sneakers.preview.emergentagent.com
```

**Option B: Terminal Command**
```bash
cd /app/frontend
npx expo start --tunnel
```
Then look for the QR code in the terminal output.

---

## 🎯 Method 2: Development Build (Advanced)

Use this if you need:
- Custom native modules
- Push notifications in production
- Full native debugging

### Prerequisites:
- EAS CLI installed: `npm install -g eas-cli`
- Expo account (free): https://expo.dev/signup
- Physical device connected or available

### Steps:

#### 1. Install EAS CLI
```bash
npm install -g eas-cli
```

#### 2. Login to Expo
```bash
eas login
```

#### 3. Configure EAS Build
```bash
cd /app/frontend
eas build:configure
```

#### 4. Create Development Build

**For iOS (needs macOS + Xcode):**
```bash
eas build --platform ios --profile development
```

**For Android:**
```bash
eas build --platform android --profile development
```

This will:
1. Upload your code to Expo servers
2. Build the app in the cloud
3. Provide download link when complete (15-30 minutes)

#### 5. Install on Device

**iOS:**
- Scan QR code from EAS to install via TestFlight
- Or download .ipa and install via Xcode

**Android:**
- Download .apk from EAS build link
- Enable "Install from Unknown Sources" on your device
- Install the .apk

#### 6. Run Development Server
```bash
cd /app/frontend
npx expo start --dev-client
```

#### 7. Open App on Device
- App will connect to development server automatically
- Hot reload enabled!

---

## 🔥 Testing Push Notifications on Real Device

### Setup for Testing:

1. **Register for notifications** (already implemented in app):
   - App will request permission on first launch
   - Token saved to Firestore

2. **Send test notification:**

   Use this script to send a test push notification:

   ```javascript
   // test-notification.js
   const fetch = require('node-fetch');

   const sendPushNotification = async (expoPushToken) => {
     const message = {
       to: expoPushToken,
       sound: 'default',
       title: 'New Match! 🛹',
       body: 'Someone posted a sneaker you were looking for!',
       data: { screen: 'home' },
     };

     await fetch('https://exp.host/--/api/v2/push/send', {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
       },
       body: JSON.stringify(message),
     });
   };

   // Get token from Firestore users collection
   const token = 'ExponentPushToken[YOUR_DEVICE_TOKEN]';
   sendPushNotification(token);
   ```

3. **Run the script:**
   ```bash
   node test-notification.js
   ```

---

## 📸 Testing Camera & Image Upload

### On Real Device:

1. **Profile Photo Upload:**
   - Go to Profile screen
   - Tap on avatar
   - Select "Choose from Library" or "Take Photo"
   - Upload should work with real device camera/gallery

2. **Sneaker Photo Upload:**
   - Go to Sell screen
   - Tap "Pick Image"
   - Test both camera and gallery options
   - Verify image uploads to Firebase Storage

---

## 🌐 Testing on Different Networks

### Test Scenarios:

1. **WiFi Connection:**
   - Connect device to WiFi
   - Test all features

2. **Mobile Data (4G/5G):**
   - Disable WiFi
   - Test app on cellular network
   - Check if slower connection affects UX

3. **Airplane Mode (Offline):**
   - Enable airplane mode
   - Test offline behavior
   - Check error messages

4. **Poor Connection:**
   - Use network throttling or move to area with poor signal
   - Test loading states
   - Verify timeout handling

---

## 🐛 Debugging on Real Device

### View Console Logs:

**iOS:**
1. Connect device to Mac
2. Open Safari → Develop → [Your Device] → [App]
3. View console logs

**Android:**
1. Enable USB Debugging on device
2. Connect to computer
3. Run: `adb logcat`
4. Or use Chrome DevTools: `chrome://inspect`

### React Native Debugger:

**On Device:**
1. Shake device
2. Tap "Debug Remote JS"
3. Opens debugger in Chrome

**Or use Expo Dev Menu:**
- Shake device to open menu
- Options: Reload, Debug, Performance Monitor

---

## 🎨 Testing Dark Mode

1. **In-App Toggle:**
   - Go to Settings screen
   - Toggle Dark Mode switch
   - Verify all screens adapt

2. **System-Level:**
   - Change device system theme (iOS Settings / Android Settings)
   - App should respect system preference on first launch

---

## ⚡ Performance Testing

### Things to Monitor:

1. **Animation Performance:**
   - Splash screen animation should be smooth (60fps)
   - Scrolling should be fluid
   - Navigation transitions should be instant

2. **Image Loading:**
   - Sneaker images should load progressively
   - No lag when scrolling through listings

3. **Memory Usage:**
   - App shouldn't crash with many images
   - Memory should be stable

4. **Battery Impact:**
   - Monitor battery drain during usage
   - Background listeners should be efficient

---

## 📊 Test Scenarios Checklist

### Authentication Flow:
- [ ] Register new account (email/password)
- [ ] Login with existing account
- [ ] Google Sign-In
- [ ] Logout (check new modal confirmation)
- [ ] Profile photo upload from camera
- [ ] Profile photo upload from gallery

### Core Features:
- [ ] View sneaker listings on home
- [ ] Search for sneakers
- [ ] Post new sneaker listing with photo
- [ ] Create search request
- [ ] Delete own listing
- [ ] Delete own search request
- [ ] View product details
- [ ] Start conversation from product page

### Messaging:
- [ ] View conversation list
- [ ] Send message in conversation
- [ ] Receive message (test with 2 devices)
- [ ] Real-time message updates

### UI/UX:
- [ ] Splash screen animation plays smoothly
- [ ] Dark mode toggle works
- [ ] All icons load correctly
- [ ] Touch targets are appropriately sized
- [ ] Keyboard doesn't overlap inputs
- [ ] Pull-to-refresh works on home feed
- [ ] Loading states show correctly
- [ ] Error messages are clear

### Edge Cases:
- [ ] App works without internet (shows error)
- [ ] App recovers when internet returns
- [ ] Large images upload successfully
- [ ] Multiple rapid taps don't cause issues
- [ ] Navigation back button works everywhere

---

## 🚨 Common Issues & Solutions

### Issue: QR Code Won't Scan
**Solution:**
- Ensure device and computer are on same network
- Try using the direct tunnel URL in Expo Go app
- Restart Expo development server

### Issue: "Unable to connect to device"
**Solution:**
- Check firewall settings
- Ensure ports 19000-19001 are open
- Try tunnel mode: `npx expo start --tunnel`

### Issue: App Crashes on Launch
**Solution:**
- Check console for error messages
- Clear Expo Go cache: Settings → Clear Cache
- Rebuild: `rm -rf node_modules && yarn install`

### Issue: Hot Reload Not Working
**Solution:**
- Shake device → Reload
- Restart dev server
- Check if "Fast Refresh" is enabled in dev menu

### Issue: Camera Permission Denied
**Solution:**
- Go to device Settings → Apps → Expo Go
- Enable Camera and Storage permissions
- Relaunch app

---

## 🎯 Production Build (App Store / Play Store)

When ready to publish your app to stores:

### 1. Create EAS Account & Configure

```bash
eas login
cd /app/frontend
eas build:configure
```

### 2. Build for Production

**iOS:**
```bash
eas build --platform ios --profile production
```

**Android:**
```bash
eas build --platform android --profile production
```

### 3. Submit to Stores

**iOS App Store:**
```bash
eas submit --platform ios
```

**Google Play Store:**
```bash
eas submit --platform android
```

### Requirements:
- **iOS**: Apple Developer Account ($99/year)
- **Android**: Google Play Developer Account ($25 one-time)
- App icons and splash screens configured
- Privacy policy and terms of service
- App Store listing details

---

## 📞 Need Help?

- **Expo Documentation**: https://docs.expo.dev/
- **Expo Forums**: https://forums.expo.dev/
- **React Native Docs**: https://reactnative.dev/
- **Firebase Docs**: https://firebase.google.com/docs

---

**Last Updated**: June 2025
**App Name**: UNPAIR
**Current Status**: Development Build Ready ✅
**Tunnel URL**: `exp://unpair-sneakers.preview.emergentagent.com`
