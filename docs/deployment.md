# Vercel Deployment & Local Development Guide

This guide provides step-by-step instructions for testing the **Toxic Comment Classifier** locally and deploying the application to **Vercel** directly from GitHub without needing any external backend services.

---

## 1. Local Development Setup

### Prerequisites
- Python 3.9+ installed
- Node.js v18+ and npm installed

### Step 1: Clone Repository & Create Virtual Environment
```powershell
# Open PowerShell in workspace root
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

### Step 2: Train Machine Learning Model
```powershell
python -m ml.train
python -m ml.evaluate
```
This generates:
- `models/toxic_classifier.joblib`
- `models/tfidf_vectorizer.joblib`
- Evaluation figures in `reports/figures/`

### Step 3: Run React Frontend (Dev Server)
```powershell
npm --prefix frontend install
npm --prefix frontend run dev
```
Open browser at `http://localhost:5173`.

---

## 2. Vercel CLI Local Testing (Full Stack Serverless Testing)

To test both React frontend AND Python API functions (`/api/predict`) in a local Vercel serverless environment:

```powershell
# Install Vercel CLI globally (if not installed)
npm install -g vercel

# Start Vercel dev server in project root
vercel dev
```
Open `http://localhost:3000` to interact with both React UI and the Python `/api/predict` endpoint.

---

## 3. Deployment to Vercel (GitHub Integration)

### Step 1: Push Code to GitHub
1. Create a new GitHub repository named `toxic-comment-classifier`.
2. Commit and push your local repository:
```powershell
git init
git add .
git commit -m "Initial commit - Complete Toxic Comment Classifier"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/toxic-comment-classifier.git
git push -u origin main
```

### Step 2: Import Repository in Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **Add New...** → **Project**.
3. Select your GitHub repository (`toxic-comment-classifier`).

### Step 3: Configure Project Settings on Vercel
- **Framework Preset**: Vite
- **Root Directory**: `./` (leave default)
- **Build Command**: `npm run build` (or `cd frontend && npm install && npm run build`)
- **Output Directory**: `frontend/dist`
- **Environment Variables**: None required!

### Step 4: Click Deploy
Vercel will:
1. Build the React frontend into static assets.
2. Auto-detect `api/predict.py` as a Python Serverless Function.
3. Install Python dependencies listed in `requirements.txt`.
4. Deploy the combined application under a single live URL.

### Step 5: Test Live Deployment
- **Frontend App**: `https://YOUR-PROJECT.vercel.app`
- **API Endpoint**: `https://YOUR-PROJECT.vercel.app/api/predict`

---

## 4. Serverless Function Constraints & Best Practices

- **Zero DB Dependency**: The app runs completely stateless.
- **Model Storage**: Artifacts are checked into git under `models/` (< 5MB compressed).
- **Execution Limits**: Vercel free tier limits serverless execution to 10 seconds (our model predicts in ~10ms).
- **Memory Limit**: Vercel allocates 1024 MB RAM, sufficient for Scikit-learn inference.
