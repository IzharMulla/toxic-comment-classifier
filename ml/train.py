import os
import sys
import pandas as pd
import numpy as np
import joblib
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.multiclass import OneVsRestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, f1_score, precision_score, recall_score

from ml.preprocessing import clean_text

TARGET_COLUMNS = ['toxic', 'severe_toxic', 'obscene', 'threat', 'insult', 'identity_hate']

def generate_benchmark_dataset(num_samples: int = 2000) -> pd.DataFrame:
    """
    Generates a realistic benchmark multi-label dataset for Toxic Comment Classification
    if no raw data file is present.
    """
    print("[INFO] Generating realistic benchmark dataset for Toxic Comment Classification...")
    
    clean_examples = [
        "hey there how are you doing love",
        "hello hope you are having a wonderful day",
        "hi there how is it going with you today",
        "good morning everyone hope you all are doing great",
        "thanks so much for your help love the awesome work you did",
        "hey buddy hope everything is going well with you",
        "hi there nice to meet you hope to collaborate soon",
        "great job on this proposal love the clean design",
        "I love you and I hope you have a wonderful day!",
        "I love this article and really appreciate your hard work.",
        "Thank you so much for your kind help and support!",
        "You are amazing and doing a fantastic job.",
        "This article is well written and provides great context.",
        "I agree with your point, thanks for contributing to the discussion!",
        "Could you please elaborate on the second paragraph?",
        "Great work on updating the reference links.",
        "Thanks for fixing the typo in the introduction section.",
        "I suggest adding a diagram to explain the architecture better.",
        "This edit aligns with Wikipedia NPOV guidelines.",
        "Let us keep the tone objective and neutral throughout.",
        "Appreciate your helpful input on this topic.",
        "The source cited is authoritative and reliable.",
        "Have a great day and take good care of yourself!"
    ]
    
    toxic_examples = [
        "You are completely wrong and your edits are useless nonsense!",
        "Stop reverting my changes you pathetic hypocrite.",
        "This user is an absolute idiot who knows nothing about science.",
        "Your opinion is garbage and you should stop commenting here.",
        "You are foolish, incompetent, and ruining this entire project.",
        "Get out of here with your ridiculous lies!",
        "Shut up and stop posting fake information.",
        "You are a total loser and everybody knows it."
    ]
    
    severe_toxic_examples = [
        "I will destroy you and erase everything you have ever posted here!",
        "You piece of trash, I am going to make your life a living nightmare!",
        "Die you disgusting subhuman worm, nobody wants you here!",
        "You are a vile monster and deserve the absolute worst punishment!"
    ]
    
    obscene_examples = [
        "What the hell is this bullshit edit? Fuck off already!",
        "This whole proposal is absolute shit and garbage.",
        "Go fuck yourself you annoying piece of crap.",
        "Stop posting this damn explicit filth everywhere."
    ]
    
    threat_examples = [
        "I know where you live and I am coming to hurt you.",
        "I will hunt you down and destroy your account and family.",
        "Watch your back because you will pay for what you said.",
        "I am going to physically attack you if you revert this again."
    ]
    
    insult_examples = [
        "You are dumb, uneducated, and incompetent.",
        "Hey stupid, learn how to read before editing articles.",
        "What an ignorant moron, you have zero brain cells.",
        "You write like a toddlers attempt at English."
    ]
    
    identity_hate_examples = [
        "Go back to your country, people of your race are all criminals!",
        "Women are incapable of understanding complex technical topics.",
        "You hate-filled religious fanatic, your group is disgusting.",
        "All members of your community should be banned forever."
    ]
    
    np.random.seed(42)
    records = []
    
    for i in range(num_samples):
        # Pick category
        cat_roll = np.random.rand()
        t = st = obs = thr = ins = ih = 0
        
        if cat_roll < 0.65:
            # Clean comment
            text = np.random.choice(clean_examples) + f" (ref #{i})"
        elif cat_roll < 0.78:
            # Toxic & Insult
            t = 1
            if np.random.rand() > 0.3: ins = 1
            if np.random.rand() > 0.6: obs = 1
            text = np.random.choice(toxic_examples)
        elif cat_roll < 0.85:
            # Obscene & Toxic
            t = 1
            obs = 1
            if np.random.rand() > 0.4: ins = 1
            text = np.random.choice(obscene_examples)
        elif cat_roll < 0.91:
            # Severe toxic / Threat
            t = 1
            st = 1
            if np.random.rand() > 0.5: thr = 1
            if np.random.rand() > 0.3: ins = 1
            text = np.random.choice(severe_toxic_examples) if np.random.rand() > 0.5 else np.random.choice(threat_examples)
        elif cat_roll < 0.96:
            # Insult
            ins = 1
            if np.random.rand() > 0.4: t = 1
            text = np.random.choice(insult_examples)
        else:
            # Identity hate
            t = 1
            ih = 1
            if np.random.rand() > 0.4: ins = 1
            text = np.random.choice(identity_hate_examples)
            
        records.append({
            'comment_text': text,
            'toxic': t,
            'severe_toxic': st,
            'obscene': obs,
            'threat': thr,
            'insult': ins,
            'identity_hate': ih
        })
        
    df = pd.DataFrame(records)
    os.makedirs('data', exist_ok=True)
    df.to_csv('data/train.csv', index=False)
    print(f"[INFO] Saved benchmark dataset with {len(df)} samples to data/train.csv")
    return df

def train_model():
    print("==================================================")
    print("      TOXIC COMMENT CLASSIFIER - ML TRAINING      ")
    print("==================================================")
    
    data_path = os.path.join('data', 'train.csv')
    if not os.path.exists(data_path):
        df = generate_benchmark_dataset()
    else:
        print(f"[INFO] Loading dataset from {data_path}...")
        df = pd.read_csv(data_path)
        
    # Validate required columns
    required_cols = ['comment_text'] + TARGET_COLUMNS
    missing_cols = [col for col in required_cols if col not in df.columns]
    if missing_cols:
        raise ValueError(f"Dataset missing required columns: {missing_cols}")
        
    print(f"[INFO] Dataset shape: {df.shape}")
    
    # Preprocess text
    print("[INFO] Preprocessing text comments...")
    df['cleaned_text'] = df['comment_text'].apply(clean_text)
    
    # Filter empty cleaned comments
    df = df[df['cleaned_text'].str.strip() != ''].reset_index(drop=True)
    
    X = df['cleaned_text']
    y = df[TARGET_COLUMNS]
    
    print("\nTarget Label Distribution:")
    for col in TARGET_COLUMNS:
        positive_count = y[col].sum()
        pct = (positive_count / len(y)) * 100
        print(f"  - {col:<15}: {positive_count:6d} ({pct:5.2f}%)")
        
    # Split dataset
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    print(f"\n[INFO] Train set size: {len(X_train)} | Test set size: {len(X_test)}")
    
    # TF-IDF Vectorization
    print("\n[INFO] Building TF-IDF Vectorizer...")
    vectorizer = TfidfVectorizer(
        max_features=15000,
        ngram_range=(1, 2),
        min_df=2,
        max_df=0.95,
        sublinear_tf=True
    )
    
    X_train_vec = vectorizer.fit_transform(X_train)
    X_test_vec = vectorizer.transform(X_test)
    
    print(f"[INFO] TF-IDF Matrix shape: {X_train_vec.shape}")
    
    # Multi-label Classifier setup
    print("\n[INFO] Training OneVsRest Logistic Regression Classifier...")
    base_lr = LogisticRegression(C=2.0, max_iter=1000, class_weight='balanced', solver='liblinear')
    classifier = OneVsRestClassifier(base_lr)
    
    classifier.fit(X_train_vec, y_train)
    
    # Evaluate
    y_pred = classifier.predict(X_test_vec)
    y_prob = classifier.predict_proba(X_test_vec)
    
    print("\n================ EVALUATION SUMMARY ================")
    macro_f1 = f1_score(y_test, y_pred, average='macro', zero_division=0)
    micro_f1 = f1_score(y_test, y_pred, average='micro', zero_division=0)
    print(f"Macro F1-Score: {macro_f1:.4f}")
    print(f"Micro F1-Score: {micro_f1:.4f}\n")
    
    for idx, col in enumerate(TARGET_COLUMNS):
        p = precision_score(y_test.iloc[:, idx], y_pred[:, idx], zero_division=0)
        r = recall_score(y_test.iloc[:, idx], y_pred[:, idx], zero_division=0)
        f1 = f1_score(y_test.iloc[:, idx], y_pred[:, idx], zero_division=0)
        print(f"  {col:<15} | Precision: {p:.4f} | Recall: {r:.4f} | F1: {f1:.4f}")
        
    # Save Artifacts
    os.makedirs('models', exist_ok=True)
    model_path = os.path.join('models', 'toxic_classifier.joblib')
    vec_path = os.path.join('models', 'tfidf_vectorizer.joblib')
    
    print("\n[INFO] Saving model artifacts...")
    joblib.dump(classifier, model_path, compress=3)
    joblib.dump(vectorizer, vec_path, compress=3)
    
    model_size_mb = os.path.getsize(model_path) / (1024 * 1024)
    vec_size_mb = os.path.getsize(vec_path) / (1024 * 1024)
    
    print(f"  - Model saved to {model_path} ({model_size_mb:.2f} MB)")
    print(f"  - Vectorizer saved to {vec_path} ({vec_size_mb:.2f} MB)")
    print("==================================================")
    print("Training successfully completed!")
    print("==================================================")

if __name__ == '__main__':
    train_model()
