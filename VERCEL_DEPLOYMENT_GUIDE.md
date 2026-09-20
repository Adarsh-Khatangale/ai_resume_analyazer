# 🚀 Vercel Deployment & Google / Supabase Setup Guide

This project is fully configured for seamless, zero-hassle deployment to **Vercel** with a serverless backend and a high-performance React (Vite) frontend.

---

## 📁 How the Vercel Setup Works

- **`vercel.json`**: Directs Vercel to build the client (`npm run build --prefix client`), serve static assets from `client/dist`, route API requests (`/api/*`) to the serverless function, and handle SPA client-side routing.
- **`api/index.js`**: Bridges Vercel serverless requests directly to the Express application.
- **`server/config/db.js`**: Automatically manages MongoDB connection caching across serverless lambda invocations.
- **`client/src/services/supabaseClient.js`**: Integrates Supabase Google OAuth so clicking "Google" produces the exact Google Sign-In screen shown in your screenshot (`Choose an account to continue to <project>.supabase.co`).

---

## 🛠️ Step 1: Deploying to Vercel

### Option A: Via Vercel Dashboard (Recommended)

1. Push your repository to **GitHub** or **GitLab**.
2. Go to [vercel.com](https://vercel.com) and click **"Add New Project"** -> **"Import"**.
3. Select your repository.
4. Keep the default settings:
   - **Framework Preset**: `Vite` (or `Other`)
   - **Root Directory**: `./` (leave blank / root)
   - **Build Command**: `npm run build --prefix client` (automatically read from `vercel.json`)
   - **Output Directory**: `client/dist` (automatically read from `vercel.json`)
5. In the **Environment Variables** section, add the variables listed below in Step 2.
6. Click **Deploy**! 🚀

---

### Option B: Via Vercel CLI

In your project directory, run:
```bash
npx vercel
```
Follow the interactive prompts:
- Set up and deploy: **`Y`**
- Which scope: Select your account
- Link to existing project: **`N`**
- What's your project's name: `ai-resume-analyzer` (or your preferred name)
- In which directory is your code located: `./`

For production deployment:
```bash
npx vercel --prod
```

---

## 🔑 Step 2: Environment Variables for Vercel

In your Vercel Project Dashboard (**Settings -> Environment Variables**), add the following:

| Variable Name | Description | Example / Default |
| :--- | :--- | :--- |
| `MONGODB_URI` | MongoDB Atlas connection string | `mongodb+srv://user:pass@cluster.mongodb.net/airesume?retryWrites=true&w=majority` |
| `JWT_SECRET` | Secret key for JWT session tokens | `super_secret_jwt_key_resume_analyzer_2025` |
| `SESSION_SECRET` | Secret key for sessions | `session_secret_key_resume_ai_38492048293` |
| `NODE_ENV` | Environment mode | `production` |
| `VITE_SUPABASE_URL` | *(Optional for Supabase OAuth)* Your Supabase project URL | `https://fxltywnaiwebfghwfqyp.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | *(Optional for Supabase OAuth)* Supabase public anon key | `eyJhbGciOi...` |
| `GOOGLE_CLIENT_ID` | *(Optional for direct Google OAuth)* Google Cloud Client ID | `your-id.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | *(Optional for direct Google OAuth)* Google Cloud Secret | `your-google-client-secret` |

> [!TIP]
> **Getting a Free MongoDB Atlas Database**:
> 1. Sign up for free at [mongodb.com/atlas](https://www.mongodb.com/atlas).
> 2. Create a free shared cluster (M0).
> 3. Under **Database Access**, create a user.
> 4. Under **Network Access**, add `0.0.0.0/0` (Allow access from anywhere for Vercel serverless IPs).
> 5. Click **Connect -> Drivers** and copy your connection URI into `MONGODB_URI`.

---

## 🌐 Step 3: Setting Up Supabase Google OAuth (Like Your Screenshot)

Your screenshot displays Google Sign-In redirecting to:
`Choose an account to continue to fxltywnaiwebfghwfqyp.supabase.co`

To get this exact experience on your Vercel deployment:

1. Go to [supabase.com](https://supabase.com) and create a project (or open your existing project).
2. Go to **Project Settings -> API** and copy:
   - **Project URL** -> `VITE_SUPABASE_URL`
   - **anon / public key** -> `VITE_SUPABASE_ANON_KEY`
3. Go to **Authentication -> Providers -> Google**:
   - Enable **Google**.
   - Paste your Google Client ID and Secret (from Google Cloud Console).
4. In Google Cloud Console (**APIs & Services -> Credentials -> OAuth 2.0 Client IDs**):
   - Add Supabase's callback URL to **Authorized redirect URIs**:
     `https://<your-project-ref>.supabase.co/auth/v1/callback`
5. In Supabase **Authentication -> URL Configuration**:
   - Add your Vercel URL (e.g., `https://your-app.vercel.app` or `https://your-app.vercel.app/dashboard`) to **Redirect URLs**.

Now, when users click the dark **"Google"** button in your Auth Modal, they will see the exact Google account chooser screen shown in your screenshot!

---

## ⚡ Step 4: Testing Your Deployed App Immediately

Even before configuring Google OAuth or MongoDB on Vercel:
- **1-Click Demo Account**: Click **"1-Click Demo Account"** inside the Auth Modal to instantly sign in as a demo user and test all features (Dashboard, Resume Scans, Radar Charts, Report PDF downloads).
- **Guest Mode**: Click **"Try Guest Mode"** on the landing page to run a free scan without an account.
