# 🔧 Quick Fix: Google Sign-In Domain Error

## Error: `Firebase: Error (auth/unauthorized-domain)`

This error occurs because your app's domain is not authorized in Firebase Console.

## Solution (Takes 2 Minutes):

### Step 1: Go to Firebase Console
1. Visit: https://console.firebase.google.com/
2. Select your project: **unpair98**

### Step 2: Navigate to Authentication Settings
1. Click **Authentication** in left sidebar
2. Click **Settings** tab at the top
3. Scroll down to **Authorized domains** section

### Step 3: Add Your Domains
Click **Add domain** and add these domains one by one:

```
unpair-sneakers.preview.emergentagent.com
localhost
127.0.0.1
```

### Step 4: Save
- Click **Add** for each domain
- Wait 1-2 minutes for changes to propagate

### Step 5: Test
- Refresh your app
- Try Google Sign-In again
- Should work now! ✅

---

## Already Authorized Domains (Default):
- `localhost` (usually pre-authorized)
- `*.firebaseapp.com` (your Firebase domain)

## Need to Add:
- ✅ `unpair-sneakers.preview.emergentagent.com` (your Emergent preview URL)
- ✅ Any custom domains you'll use in production

---

**After adding these domains, Google Sign-In will work immediately!**
