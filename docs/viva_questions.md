# Toxic Comment Classification - Comprehensive Viva Questions & Answers

This document contains **40+ viva and project defense questions with detailed technical answers**, categorized across **Machine Learning**, **Natural Language Processing (NLP)**, and **Cloud / Serverless Deployment**.

---

## Category 1: Machine Learning Core (Questions 1–15)

### Q1: What is Supervised Learning?
**Answer**: Supervised learning is a machine learning paradigm where the algorithm is trained on a labeled dataset containing pairs of input features ($X$) and corresponding ground-truth target outputs ($y$). The model learns a mapping function $f: X \to y$ that minimizes prediction error on unseen data.

### Q2: What is Classification in Machine Learning?
**Answer**: Classification is a supervised learning task where the target output $y$ consists of discrete categorical variables (e.g., Toxic vs Non-Toxic), as opposed to regression where targets are continuous real values.

### Q3: What is Multi-Label Classification, and how does it differ from Multi-Class Classification?
**Answer**:
- **Multi-Class Classification**: An instance belongs to exactly *one* class out of $N$ mutually exclusive categories (e.g., predicting digit 0 through 9).
- **Multi-Label Classification**: An instance can belong to *multiple* non-mutually exclusive categories simultaneously. For example, a single comment can be tagged as both `toxic` and `insult`.

### Q4: Why did you select One-vs-Rest (OvR) classification for this project?
**Answer**: One-vs-Rest (also known as Binary Relevance) decomposes a $K$-label multi-label problem into $K$ independent binary classification tasks. For each label $k \in \{1, \dots, 6\}$, an independent estimator is trained to classify instance $x$ as label $k$ vs non-label $k$. It is computationally efficient, scalable, and allows independent threshold tuning per class.

### Q5: What is Logistic Regression?
**Answer**: Logistic Regression is a linear classification algorithm that models the log-odds of a binary event as a linear combination of input features. It applies the sigmoid function $\sigma(z) = \frac{1}{1 + e^{-z}}$ to map linear outputs to probabilities between 0 and 1.

### Q6: What is Class Imbalance, and how is it handled in this project?
**Answer**: Class Imbalance occurs when positive instances of a target class are significantly rarer than negative instances (e.g., threat comments form < 5% of dataset). Unhandled class imbalance causes models to favor majority classes. We mitigate this by setting `class_weight='balanced'` in Logistic Regression, which scales loss penalization inversely proportional to class frequencies.

### Q7: Why is F1-Score preferable to Accuracy for this project?
**Answer**: Accuracy is misleading on imbalanced datasets because predicting all instances as non-toxic yields high accuracy while failing to detect harmful comments. F1-Score is the harmonic mean of Precision and Recall, providing a balanced metric that penalizes both False Positives and False Negatives.

### Q8: What is the difference between Precision and Recall?
**Answer**:
- **Precision**: Proportion of correctly predicted positive comments out of all comments flagged as positive ($\frac{TP}{TP + FP}$). Indicates model precision/confidence.
- **Recall**: Proportion of actual toxic comments correctly identified by the model ($\frac{TP}{TP + FN}$). Indicates model coverage/sensitivity.

### Q9: What is Overfitting, and how do you detect and prevent it?
**Answer**: Overfitting occurs when a model memorizes noise in the training set and fails to generalize to unseen test data. We detect it by comparing train F1 vs test F1. We prevent it via L2 regularization in Logistic Regression, TF-IDF feature capping (`max_features=15000`), `min_df=2` filtering, and train-test splits.

### Q10: What is a Confusion Matrix?
**Answer**: A tabular summary comparing actual ground-truth labels against model predictions, showing True Positives (TP), True Negatives (TN), False Positives (FP), and False Negatives (FN). In multi-label settings, a separate $2 \times 2$ confusion matrix is calculated per target class.

### Q11: What is Macro-averaging vs Micro-averaging?
**Answer**:
- **Macro-average**: Computes metrics (Precision, Recall, F1) independently for each class and takes their unweighted arithmetic mean. Gives equal importance to rare classes (e.g., `threat`).
- **Micro-average**: Aggregates total TPs, FPs, and FNs across all classes first before computing global metrics. Dominated by frequent classes.

### Q12: Why use linear models (Logistic Regression) over deep learning (BERT/LSTM) for this deployment?
**Answer**: Logistic Regression paired with TF-IDF provides high inference speed (< 10 ms), low cold-start latency (< 300 ms), tiny artifact footprint (< 5 MB), and zero GPU requirements, making it perfectly suited for serverless deployment on Vercel's free tier.

### Q13: What is the Sigmoid activation function?
**Answer**: A mathematical function $\sigma(z) = \frac{1}{1 + e^{-z}}$ that squashes any real number $z \in (-\infty, \infty)$ into a valid probability range $(0, 1)$.

### Q14: How are probabilities converted into binary label predictions in the frontend?
**Answer**: The API returns estimated probability floats for all 6 classes. A probability threshold $\ge 0.40$ (or 40%) is applied to activate class badges in the UI.

### Q15: What is cross-validation?
**Answer**: A model evaluation technique where the dataset is split into $K$ equal folds. The model is trained on $K-1$ folds and validated on the remaining fold, repeating $K$ times to yield an unbiased performance estimate.

---

## Category 2: Natural Language Processing (Questions 16–28)

### Q16: What is TF-IDF?
**Answer**: Term Frequency-Inverse Document Frequency is a numerical statistic reflecting how important a word is to a document relative to a collection of documents (corpus).

### Q17: How is TF (Term Frequency) calculated?
**Answer**: $\text{TF}(t, d)$ measures the frequency of term $t$ in document $d$. In our project, sublinear term frequency scaling $1 + \log(\text{count})$ is used to prevent heavily repeated words from dominating features.

### Q18: How is IDF (Inverse Document Frequency) calculated?
**Answer**: $\text{IDF}(t, D) = \log \left( \frac{1 + |D|}{1 + |\{d \in D : t \in d\}|} \right) + 1$. It down-weights common terms (like "the", "is") while boosting rare informative terms (like "idiot", "destroy").

### Q19: What is Tokenization?
**Answer**: The process of splitting a raw text string into smaller structural units called tokens (words, subwords, or symbols).

### Q20: What are N-grams, and why are bigrams included?
**Answer**: An n-gram is a contiguous sequence of $n$ items from text. Unigrams ($n=1$) represent single words. Bigrams ($n=2$) capture two-word phrases like *"not good"* or *"shut up"*, preserving crucial contextual meaning that single words miss.

### Q21: What are Stopwords, and why filter them?
**Answer**: Stopwords are high-frequency words (e.g., "a", "an", "the", "in") that carry little semantic distinction. Filtering them reduces vocabulary dimensionality and focuses learning on sentiment-bearing terms.

### Q22: What is the difference between Stemming and Lemmatization?
**Answer**:
- **Stemming**: Heuristic process that chops off word ends (e.g., "running" $\to$ "runn"). Faster but can produce non-dictionary roots.
- **Lemmatization**: Morphological analysis that maps words to canonical dictionary lemmas (e.g., "better" $\to$ "good").

### Q23: Why did you use regex text cleaning instead of heavy NLTK stemmers in production?
**Answer**: Custom regex preprocessing is extremely fast, lightweight, deterministic, and requires no external NLTK data downloads (e.g., `punkt`, `wordnet`) during Vercel serverless execution.

### Q24: What does `max_features=15000` do in `TfidfVectorizer`?
**Answer**: It restricts the TF-IDF vocabulary to the top 15,000 terms ranked by term frequency across the corpus, reducing memory consumption and preventing overfitting on noisy rare terms.

### Q25: What does `min_df=2` and `max_df=0.95` mean?
**Answer**:
- `min_df=2`: Ignores words that appear in fewer than 2 documents (filters typos/outliers).
- `max_df=0.95`: Ignores words that appear in more than 95% of documents (filters ubiquitous non-informative terms).

### Q26: How are user mentions (`@user`) and URLs handled?
**Answer**: They are stripped using regular expressions during preprocessing because specific usernames and URLs do not carry generalizable toxicity signals.

### Q27: How does the model handle out-of-vocabulary (OOV) words during prediction?
**Answer**: `TfidfVectorizer.transform()` ignores words not seen during initial training. The prediction relies on the remaining recognized n-grams present in the vectorizer vocabulary.

### Q28: Why is lowercasing essential in text classification?
**Answer**: Lowercasing ensures that words like "Toxic", "TOXIC", and "toxic" map to the exact same feature vector entry rather than creating three separate sparse features.

---

## Category 3: Cloud, Vercel & Deployment Architecture (Questions 29–40+)

### Q29: What is Serverless Computing?
**Answer**: A cloud execution model where cloud providers dynamically manage allocation of machine resources. Developers deploy code functions without provisioning, managing, or scaling underlying virtual servers.

### Q30: Why was Vercel chosen for this project instead of Render, AWS, or Railway?
**Answer**: Vercel allows hosting both the React single-page frontend AND Python serverless API functions under **one unified GitHub repository and project**, eliminating multi-service management, CORS errors, and separate backend hosting fees.

### Q31: What is a Vercel Python Serverless Function?
**Answer**: A Python file placed inside the `api/` directory (e.g., `api/predict.py`) that Vercel automatically exposes as an HTTP endpoint. It runs on demand in an isolated container whenever a request arrives.

### Q32: Why use a relative API path `/api/predict` in the React frontend?
**Answer**: Because frontend static assets and serverless functions are served under the exact same domain name (e.g., `https://app.vercel.app`), relative paths auto-route correctly locally and in production without needing `VITE_API_URL` environment variables or CORS headers.

### Q33: Why avoid FastAPI / Flask frameworks for the deployed Vercel function?
**Answer**: Frameworks like FastAPI or Flask add extra HTTP wrapper overhead and dependency weight. Using standard Vercel Python HTTP Handlers (`BaseHTTPRequestHandler`) ensures the smallest package size and fastest execution time.

### Q34: How is model reloading prevented across requests in Vercel?
**Answer**: We use a **module-level global caching pattern**:
```python
_MODEL_CACHE = None
_VECTORIZER_CACHE = None
```
When Vercel reuses a warm serverless execution context for consecutive requests, the cached model in RAM is returned instantly without reading disk artifacts.

### Q35: What happens during a Vercel Serverless "Cold Start"?
**Answer**: When a request arrives and no warm serverless container exists, Vercel provisions a micro-container, initializes the Python runtime, loads `api/predict.py`, un-pickles the `.joblib` model artifacts into RAM, and executes the handler. This initial request takes ~200–300 ms; subsequent requests take ~10 ms.

### Q36: Where are the trained model artifacts stored?
**Answer**: Serialized artifacts (`models/toxic_classifier.joblib` and `models/tfidf_vectorizer.joblib`) are checked into GitHub under `models/` (< 5 MB compressed) and loaded directly by the serverless function.

### Q37: Why is the raw training dataset (`data/train.csv`) NOT deployed to Vercel?
**Answer**: Raw training datasets are only needed during training. Deployed serverless environments only require the serialized model and vectorizer for inference. Omitting raw data keeps deployment package size tiny (< 10 MB).

### Q38: How does input validation protect the serverless API?
**Answer**:
1. Checks for empty/missing strings to prevent null pointer exceptions.
2. Enforces a 5,000 character maximum length limit to prevent memory exhaustion attacks.
3. Wraps JSON parsing in try-except blocks to catch malformed payloads.
4. Suppresses internal stack traces in HTTP responses to prevent information disclosure.

### Q39: What is `vercel.json` used for?
**Answer**: `vercel.json` is the configuration manifest informing Vercel of the build command (`cd frontend && npm install && npm run build`), output directory (`frontend/dist`), and path rewrites mapping `/api/predict` to `api/predict.py`.

### Q40: How would you scale this system to handle millions of daily users?
**Answer**:
1. Add Edge Caching / Cloudflare CDN in front of common queries.
2. Export trained Scikit-learn model parameters to ONNX format for C++ / Rust edge runtime execution.
3. Distribute model evaluation across multi-region serverless clusters.
