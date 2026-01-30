# 🚀 Deploying to Vercel (Free)

Vercel is a global cloud platform for static sites and Serverless Functions. It fits your project perfectly.

## ✅ Prerequisites

1.  **Vercel Account**: Sign up at [vercel.com](https://vercel.com) (use your GitHub account).
2.  **GitHub Repository**: Your code must be pushed to GitHub.

## 🛠️ Step-by-Step Deployment

### 1. Push to GitHub
If you haven't already, push your latest code:
```powershell
git add .
git commit -m "Migrate to Vercel"
git push
```

### 2. Import Project in Vercel
1.  Go to your [Vercel Dashboard](https://vercel.com/dashboard).
2.  Click **"Add New..."** -> **"Project"**.
3.  Find your repository (`Ether-Soul` or similar) and click **Import**.

### 3. Configure Project
-   **Framework Preset**: Select **"Other"** (or just leave default).
-   **Root Directory**: `./` (default).
-   **Build Command**: `(leave empty)`
-   **Output Directory**: `(leave empty)` or `.` if required, but usually for static HTML sites Vercel detects it.

### 4. 🔐 Environment Variables (CRITICAL)
Expand the **"Environment Variables"** section and add:

-   **Name**: `GROQ_API_KEY`
-   **Value**: `(Your Groq API Key starting with gsk_...)`

*(You don't need to add Supabase keys here unless you use them in the backend API. Since Supabase is used on the frontend, those keys are in your `index.html` and `script.js` already)*

### 5. Deploy
1.  Click **"Deploy"**.
2.  Wait for the checks and build to complete.
3.  **Done!** You will get a URL like `https://ether-soul.vercel.app`.

## 🧪 Testing
-   Visit your new Vercel URL.
-   The chat should work (it now calls `/api/chat`).
-   Authentication should work (Supabase handles this).

## ❓ Common Issues
-   **404 on Chat**: Make sure `api/chat.js` exists in your repo.
-   **Auth Error**: Make sure you added your **Vercel domain** (e.g., `https://ether-soul.vercel.app`) to your **Supabase Auth > URL Configuration** as a valid Redirect URL.
