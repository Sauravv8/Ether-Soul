# 🔑 Step-by-Step: Create a Fresh, Working Gemini API Key

## Method 1: Google AI Studio (RECOMMENDED - Easiest!)

### Step 1: Go to Google AI Studio
Visit: https://aistudio.google.com/

### Step 2: Sign In
- Sign in with your Google account
- Use the same account you want to use for billing

### Step 3: Create API Key
1. Look for **"Get API key"** button (top right corner)
2. Click it
3. You'll see a dialog with options:

   **Option A: Create API key in new project**
   - Click this if you don't have an existing project
   - AI Studio will automatically create a new Google Cloud project
   - The API will be AUTO-ENABLED ✅
   
   **Option B: Create API key in existing project**
   - Only use if you have an existing Google Cloud project
   - Select your project from dropdown
   - Click "Create API key"

### Step 4: Copy Your Key
- A new API key will appear (starts with "AIza...")
- Click the **COPY** button
- Save it somewhere safe (you'll need it in a moment)

### Step 5: Verify the Key Works
Back in VS Code, run this in PowerShell:

```powershell
# Replace YOUR_NEW_KEY_HERE with the key you just copied
$apiKey = "YOUR_NEW_KEY_HERE"
$url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=$apiKey"
$body = '{"contents":[{"parts":[{"text":"Say hello in one word"}]}]}' | ConvertTo-Json

Invoke-RestMethod -Uri $url -Method POST -Body $body -ContentType "application/json"
```

If you see a response with "hello" or similar, **YOUR KEY WORKS!** ✅

---

## Method 2: Google Cloud Console (Advanced)

### Step 1: Go to Google Cloud Console
Visit: https://console.cloud.google.com/

### Step 2: Create or Select Project
1. Click the project dropdown (top left, next to "Google Cloud")
2. Click **"NEW PROJECT"**
3. Enter project name: "EtherSoul" or anything you like
4. Click **CREATE**
5. Wait for project creation (takes ~30 seconds)

### Step 3: Enable Generative Language API
1. Go to: https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com
2. Make sure your new project is selected (top dropdown)
3. Click the **ENABLE** button
4. Wait for API to enable (~10-20 seconds)

### Step 4: Create Credentials
1. Go to: https://console.cloud.google.com/apis/credentials
2. Click **"+ CREATE CREDENTIALS"**
3. Select **"API key"**
4. A dialog will appear with your new API key
5. Click **COPY** to copy the key
6. Optional: Click **"EDIT API KEY"** to add restrictions:
   - Application restrictions: None (for testing)
   - API restrictions: Select "Generative Language API"
   - Click **SAVE**

### Step 5: Test the Key
Use the PowerShell test command from Method 1, Step 5

---

## ⚠️ Common Issues & Solutions

### Issue 1: "API key not found" or 404 Error
**Solution:** Wait 1-2 minutes after creating the key, then try again

### Issue 2: "This API key is not authorized"
**Solution:** 
1. Go to: https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com
2. Make sure "Generative Language API" is ENABLED
3. Make sure you're in the correct project

### Issue 3: "Billing must be enabled"
**Solution:** 
1. Go to: https://console.cloud.google.com/billing
2. Link a billing account (Google offers $300 free credit for new users)
3. Gemini has a generous FREE tier, so you likely won't be charged

---

## 🎯 What to Do After Getting a Working Key

### 1. Update Netlify Environment Variable
1. Go to: https://app.netlify.com
2. Select your site: **euphonious-cucurucho-f73f73**
3. Go to: **Site configuration** → **Environment variables**
4. Find `GEMINI_API_KEY` (or create it if missing)
5. Paste your NEW working API key
6. Click **SAVE**

### 2. Update Your Test File (Optional)
Replace the key in `test-api.ps1`:
```powershell
$apiKey = "YOUR_NEW_WORKING_KEY_HERE"
```

### 3. Deploy Your Site
If you haven't installed Node.js yet, you need to do that first.

Once Node.js is installed:
```powershell
cd "c:\Users\user\Desktop\voice ether"
npm install
git add .
git commit -m "Update to secure API configuration"
git push
```

Netlify will auto-deploy and your site will work with the secure API key! 🚀

---

## 📋 Quick Checklist

- [ ] Visit https://aistudio.google.com/
- [ ] Click "Get API key"
- [ ] Choose "Create API key in new project"
- [ ] Copy the API key
- [ ] Test it with PowerShell command
- [ ] Add to Netlify environment variables as `GEMINI_API_KEY`
- [ ] Redeploy your site

**Done!** Your site will now give accurate AI responses! 🎉
