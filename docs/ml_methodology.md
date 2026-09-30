# Machine Learning Methodology & Mathematical Formulation

This document details the Machine Learning pipeline, mathematical formulation, feature engineering, classification strategy, and evaluation metrics implemented for the **Toxic Comment Classification System**.

---

## 1. Problem Formulation: Multi-Label Text Classification

Unlike binary classification (e.g., Spam vs. Not Spam) or multi-class classification (e.g., Digit Recognition 0-9), toxic comment classification is a **multi-label classification problem**.

Given an input comment string $x$, the objective is to predict a binary label vector $\mathbf{y} \in \{0, 1\}^K$, where $K = 6$ represents the toxicity categories:
1. `toxic`
2. `severe_toxic`
3. `obscene`
4. `threat`
5. `insult`
6. `identity_hate`

A single comment can simultaneously be tagged with zero, one, or multiple labels (e.g., $\mathbf{y} = [1, 0, 1, 0, 1, 0]$ indicating toxic, obscene, and insult).

---

## 2. Text Preprocessing Pipeline

Raw internet text contains noise such as URLs, HTML tags, IP addresses, user handles, punctuation, and varying casing. Preprocessing transforms raw text into standardized strings:

1. **Lowercasing**: Normalizes casing across terms.
2. **URL Removal**: Strip `http://`, `https://`, and `www.` patterns using regular expression `r'https?://\S+|www\.\S+'`.
3. **HTML Tag Stripping**: Remove HTML formatting using `r'<.*?>'`.
4. **IP Address & Mention Stripping**: Filter IP strings (`r'\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b'`) and handles (`r'@\w+'`).
5. **Special Character Cleaning**: Retain alphanumeric characters and basic spaces (`r'[^a-z0-9\s]'`).
6. **Whitespace Normalization**: Collapse multiple consecutive spaces and strip boundary whitespace.

---

## 3. Feature Engineering: TF-IDF Vectorization

Term Frequency-Inverse Document Frequency (TF-IDF) converts text strings into numerical feature vectors by weighting term frequency against corpus frequency.

### Mathematical Definition:
For a term $t$ in a document $d$ within corpus $D$:

$$\text{TF-IDF}(t, d, D) = \text{TF}(t, d) \times \text{IDF}(t, D)$$

Where sublinear term frequency is used:
$$\text{TF}(t, d) = 1 + \log(\text{f}_{t,d}) \quad \text{if } \text{f}_{t,d} > 0$$

And Inverse Document Frequency is defined as:
$$\text{IDF}(t, D) = \log \left( \frac{1 + |D|}{1 + |\{d \in D : t \in d\}|} \right) + 1$$

### Vectorizer Parameters:
- `max_features=15000`: Caps top features based on corpus frequency.
- `ngram_range=(1, 2)`: Captures both individual terms (unigrams) and adjacent word pairs (bigrams like *"shut up"*, *"hate you"*).
- `min_df=2`: Excludes rare terms appearing in fewer than 2 documents.
- `max_df=0.95`: Filters common corpus words appearing in > 95% of documents.
- `sublinear_tf=True`: Applies logarithmic scaling to term frequencies to diminish impact of word repetition.

---

## 4. Multi-Label Classification Strategy: One-vs-Rest (OvR)

We decompose the multi-label problem into $K=6$ independent binary classification problems using the **One-vs-Rest (OvR)** binary relevance strategy.

For each target label $k \in \{1, \dots, 6\}$, an independent binary classifier $f_k(x)$ is trained to estimate the probability $P(y_k = 1 \mid x)$.

### Base Estimator: Logistic Regression
The posterior probability for class $k$ is computed using the sigmoid function:

$$P(y_k = 1 \mid x) = \sigma(\mathbf{w}_k^T \mathbf{x} + b_k) = \frac{1}{1 + e^{-(\mathbf{w}_k^T \mathbf{x} + b_k)}}$$

Where:
- $\mathbf{x} \in \mathbb{R}^M$ is the TF-IDF feature vector.
- $\mathbf{w}_k$ and $b_k$ are the learned weights and bias parameter for label $k$.

### Class Imbalance Handling:
Toxicity datasets exhibit severe class imbalance (e.g., threats represent < 1% of total comments). To prevent majority class dominance, we use `class_weight='balanced'`, which automatically adjusts weights inversely proportional to class frequencies:

$$w_{c} = \frac{N}{2 \times N_c}$$

---

## 5. Evaluation Metrics

Because standard Accuracy requires all $K$ labels to match exactly (Exact Match Ratio), it is overly harsh for multi-label datasets. We evaluate model performance using:

### Precision:
$$P_k = \frac{TP_k}{TP_k + FP_k}$$

### Recall:
$$R_k = \frac{TP_k}{TP_k + FN_k}$$

### F1-Score (Harmonic Mean):
$$F1_k = 2 \cdot \frac{P_k \cdot R_k}{P_k + R_k}$$

### Macro & Micro Averaging:
- **Macro F1**: Unweighted mean F1-score across all 6 classes (treats all classes equally regardless of frequency).
- **Micro F1**: Aggregates total $TP, FP, FN$ across all classes before computing overall F1.
