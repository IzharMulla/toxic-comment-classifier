# Toxic Comment Classification Using Machine Learning

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)
[![Python Version](https://img.shields.io/badge/python-3.9%20%7C%203.10%20%7C%203.11%20%7C%203.12-blue)](https://www.python.org/)
[![React Version](https://img.shields.io/badge/react-18.2.0-cyan)](https://react.dev/)
[![Scikit-Learn](https://img.shields.io/badge/scikit--learn-1.3%2B-orange)](https://scikit-learn.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> **College Final Year Machine Learning Project**  
> An end-to-end multi-label toxic comment classification web application built with **React**, **Vite**, **Tailwind CSS**, and **Scikit-learn**, designed specifically for single-click, zero-overhead deployment on **Vercel** via Python Serverless Functions.

---

## 🔗 Live Demo & Links

- **Live Web Application**: `ADD_VERCEL_URL` *(Replace with your live Vercel URL after deployment)*
- **API Endpoint**: `https://YOUR-PROJECT.vercel.app/api/predict`
- **Documentation**: [Architecture Documentation](docs/architecture.md) | [ML Methodology](docs/ml_methodology.md) | [Deployment Guide](docs/deployment.md) | [Viva Q&A](docs/viva_questions.md)

---

## 📌 1. Project Overview & Problem Statement

Online discussion platforms, social media, and open-source wikis frequently suffer from toxic comments, verbal abuse, harassment, and hate speech. Manual moderation fails to scale across millions of daily interactions.

This project implements an automated, real-time **Multi-Label Toxic Comment Classifier** capable of identifying 6 distinct categories of toxicity in user-submitted comments:
1. `toxic`
2. `severe_toxic`
3. `obscene`
4. `threat`
5. `insult`
6. `identity_hate`

---

## 🎯 2. Objectives

- **Multi-Label Classification**: Classify comments into non-mutually exclusive toxicity categories simultaneously.
- **Serverless Architecture**: Deploy the entire stack (React UI + Python ML endpoint) on a single Vercel project connected to GitHub with **zero external backend hosting** (no Render, Railway, AWS, or databases).
- **Fast Inference**: Achieve sub-second response times using lightweight serialized Scikit-learn models (`< 5 MB`).
- **Production UX**: Provide an interactive UI with animated progress bars, input validation, character counters, and sample presets.

---

## 💻 3. Technology Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons
- **Machine Learning**: Python 3.9+, Scikit-learn, Joblib, NumPy, Pandas, Matplotlib, Seaborn
- **API Runtime**: Vercel Python Serverless Functions (`/api/predict`)
- **Deployment Platform**: Vercel (GitHub Integration)

---

## 🏗️ 4. System Architecture

```text
                    USER
                      ↓
              React + Vite Frontend
                      ↓
                   Vercel
                      ↓
             /api/predict endpoint
                      ↓
             Python Serverless Function
                      ↓
              Scikit-learn Model
                      ↓
              TF-IDF Vectorizer
                      ↓
             Toxicity Predictions
                      ↓
              React UI
```

---

## 📁 5. Project Structure

```text
toxic-comment-classifier/
│
├── api/
│   └── predict.py                  # Vercel Python Serverless Function
│
├── ml/
│   ├── train.py                    # Dataset loading, training, artifact saving
│   ├── evaluate.py                 # Evaluation metrics and figure generation
│   └── preprocessing.py           # Text cleaning regex functions
│
├── models/
│   ├── toxic_classifier.joblib     # OneVsRest Logistic Regression artifact
│   └── tfidf_vectorizer.joblib     # TF-IDF N-gram Vectorizer artifact
│
├── data/
│   └── README.md                   # Dataset setup instructions
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx          # Header navigation bar
│   │   │   ├── Hero.jsx            # Hero section with feature pills
│   │   │   ├── CommentInput.jsx    # Textarea, char counter, test presets
│   │   │   ├── PredictionResult.jsx# Verdict banner & category scores
│   │   │   ├── ToxicityBar.jsx     # Animated score progress bar
│   │   │   ├── ModelInfo.jsx       # ML architecture breakdown tab
│   │   │   ├── Loading.jsx         # Loading spinner state
│   │   │   └── ErrorMessage.jsx    # Error alert banner
│   │   │
│   │   ├── services/
│   │   │   └── api.js              # Native relative fetch service (/api/predict)
│   │   │
│   │   ├── App.jsx                 # Main application component
│   │   ├── main.jsx                # React entry point
│   │   └── index.css               # Tailwind CSS & global styles
│   │
│   ├── package.json
│   └── vite.config.js
│
├── notebooks/
│   └── exploratory_analysis.ipynb  # Jupyter notebook for EDA
│
├── reports/
│   └── figures/                    # Generated confusion matrices & plots
│
├── docs/
│   ├── architecture.md             # System architecture documentation
│   ├── ml_methodology.md           # Mathematical formulation & NLP details
│   ├── deployment.md               # Detailed Vercel deployment guide
│   └── viva_questions.md           # 40+ Viva questions and answers
│
├── requirements.txt                # Python serverless dependencies
├── vercel.json                     # Vercel routing & build configuration
├── package.json                    # Root npm build scripts
├── .gitignore                      # Git ignore file
└── README.md                       # Project documentation
```

---

## ⚙️ 6. Local Installation & Setup

### Step 1: Clone Repository & Setup Virtual Environment
```powershell
# Clone repository
git clone https://github.com/YOUR_USERNAME/toxic-comment-classifier.git
cd toxic-comment-classifier

# Create virtual environment
python -m venv .venv

# Activate virtual environment (Windows PowerShell)
.venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt
```

### Step 2: Train Machine Learning Model
```powershell
python -m ml.train
python -m ml.evaluate
```

### Step 3: Run Frontend Locally
```powershell
npm --prefix frontend install
npm --prefix frontend run dev
```
Open `http://localhost:5173` in your browser.

---

## 🌐 7. Vercel Local Serverless Testing

To test both React Frontend and Python Serverless API together using Vercel CLI:
```powershell
npm install -g vercel
vercel dev
```
Open `http://localhost:3000`.

---

## 🚀 8. Deploying to Vercel (Step-by-Step)

1. Push your completed project repository to **GitHub**.
2. Log into [Vercel](https://vercel.com).
3. Click **Add New...** → **Project** and select your GitHub repository.
4. Set Framework Preset to **Vite**.
5. Click **Deploy**. Vercel automatically builds the frontend and provisions `/api/predict.py` as a Python Serverless Function.

---

## 📡 9. API Documentation

### Endpoint: `POST /api/predict`

#### Request Body
```json
{
  "text": "You are completely wrong and your edits are useless nonsense!"
}
```

#### Response (HTTP 200 OK)
```json
{
  "text": "You are completely wrong and your edits are useless nonsense!",
  "predictions": {
    "toxic": 0.9453,
    "severe_toxic": 0.0512,
    "obscene": 0.1245,
    "threat": 0.0102,
    "insult": 0.8734,
    "identity_hate": 0.0089
  },
  "labels": [
    "toxic",
    "insult"
  ]
}
```

#### Error Response (HTTP 400 Bad Request)
```json
{
  "error": "Comment cannot be empty."
}
```

---

## 📊 10. Model Performance & Results

Evaluating on test split:

| Category | Precision | Recall | F1-Score |
| :--- | :---: | :---: | :---: |
| **Toxic** | 0.95 | 1.00 | **0.97** |
| **Severe Toxic** | 1.00 | 1.00 | **1.00** |
| **Obscene** | 0.61 | 1.00 | **0.76** |
| **Threat** | 0.47 | 1.00 | **0.64** |
| **Insult** | 0.77 | 1.00 | **0.87** |
| **Identity Hate** | 1.00 | 1.00 | **1.00** |
| **Macro Average** | **0.80** | **1.00** | **0.87** |

---

## 🎓 11. Viva Questions & Examination Prep

We have prepared **40+ viva examination questions** with detailed answers covering ML algorithms, NLP concepts, and Vercel serverless deployment in [`docs/viva_questions.md`](docs/viva_questions.md).

---

## ⚠️ 12. Limitations & Future Scope

- **Contextual Nuance**: TF-IDF n-grams may miss complex sarcastic comments.
- **Future Scope**: Fine-tune lightweight Transformer models (e.g., DistilBERT) or ONNX runtimes for further accuracy improvements.

---

## 📜 13. License

Distributed under the MIT License. See `LICENSE` for more information.
