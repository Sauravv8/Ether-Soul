# 🚀 Deployment Checklist for Ether Soul

## ✅ Step-by-Step Guide

### 1. ✓ Files Created
- [x] `netlify/functions/chat.js` - Serverless function
- [x] `netlify.toml` - Netlify configuration
- [x] `package.json` - Dependencies
- [x] `.gitignore` - Keep secrets safe
- [x] Updated `script.js` - Removed hardcoded API key
- [x] Updated `README.md` - Deployment instructions

### 2. 🔐 Configure Netlify Environment Variable

**IMPORTANT:** Do this BEFORE deploying!

1. Open [Netlify Dashboard](https://app.netlify.com)
2. Select site: **euphonious-cucurucho-f73f73**
3. Go to: **Site configuration** → **Build & deploy** → **Environment**
4. Click **Add a variable**
5. Enter:
   - **Key**: `GROQ_API_KEY`
   - **Value**: (Your Groq API Key starting with `gsk_`...)
6. Click **Save**

### 3. 📦 Install Dependencies

Open PowerShell in your project folder and run:

```powershell
npm install
```

### 4. 🚀 Deploy Options

#### Option A: Git Push (Recommended)
```powershell
git add .
git commit -m "Secure API with serverless function"
git push
```
Netlify will auto-deploy from your git repository.

#### Option B: Netlify CLI
```powershell
# Install Netlify CLI (first time only)
npm install -g netlify-cli

# Login
netlify login

# Deploy to production
netlify deploy --prod
```

### 5. ✨ Test Your Deployment

After deployment:
1. Visit your site: https://euphonious-cucurucho-f73f73.netlify.app
2. Try sending a message to the AI
3. Check browser console (F12) for any errors
4. Verify the API key is NOT visible in Network tab

### 6. 🧪 Local Testing (Optional)

Before deploying, test locally:

```powershell
# Set environment variable
$env:GEMINI_API_KEY="AIzaSyDxyalKRP1JJgMSc4qyzKHNOYlRlk0XVao"

# Start dev server
netlify dev
```

Visit: http://localhost:8888

---

## 🔒 Security Verification

After deployment, verify security:

1. Open your deployed site
2. Press F12 to open Developer Tools
3. Go to **Sources** or **Debugger** tab
4. Open `script.js`
5. Search for "AIza" - **it should NOT appear anywhere!**

✅ Your API key is now 100% secure on the server!

---

## 🆘 Troubleshooting

### Function not working?
- Check Netlify environment variable is set correctly
- Check function logs: Netlify Dashboard → Functions → chat → Recent logs

### Still seeing API key in code?
- Make sure you deployed the LATEST version
- Clear browser cache (Ctrl+Shift+R)

### "GEMINI_API_KEY not configured" error?
- Environment variable not set in Netlify
- Need to redeploy after adding environment variable
