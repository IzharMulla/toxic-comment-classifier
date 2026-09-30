import os
import sys
import pandas as pd
import numpy as np
import joblib
import matplotlib
matplotlib.use('Agg') # Non-interactive backend for server/script execution
import matplotlib.pyplot as plt
import seaborn as sns

from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, confusion_matrix, f1_score, precision_score, recall_score, multilabel_confusion_matrix

from ml.preprocessing import clean_text

TARGET_COLUMNS = ['toxic', 'severe_toxic', 'obscene', 'threat', 'insult', 'identity_hate']

def evaluate_model():
    print("==================================================")
    print("     TOXIC COMMENT CLASSIFIER - MODEL EVALUATION  ")
    print("==================================================")
    
    model_path = os.path.join('models', 'toxic_classifier.joblib')
    vec_path = os.path.join('models', 'tfidf_vectorizer.joblib')
    data_path = os.path.join('data', 'train.csv')
    
    if not os.path.exists(model_path) or not os.path.exists(vec_path):
        raise FileNotFoundError("Model or Vectorizer artifact missing. Please run `python -m ml.train` first.")
        
    if not os.path.exists(data_path):
        raise FileNotFoundError("Dataset file `data/train.csv` missing.")
        
    print(f"[INFO] Loading artifacts from {model_path} and {vec_path}...")
    classifier = joblib.load(model_path)
    vectorizer = joblib.load(vec_path)
    
    print(f"[INFO] Loading dataset from {data_path}...")
    df = pd.read_csv(data_path)
    df['cleaned_text'] = df['comment_text'].apply(clean_text)
    df = df[df['cleaned_text'].str.strip() != ''].reset_index(drop=True)
    
    X = df['cleaned_text']
    y = df[TARGET_COLUMNS]
    
    _, X_test, _, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    
    X_test_vec = vectorizer.transform(X_test)
    y_pred = classifier.predict(X_test_vec)
    y_prob = classifier.predict_proba(X_test_vec)
    
    os.makedirs(os.path.join('reports', 'figures'), exist_ok=True)
    
    # 1. Class Distribution Plot
    plt.figure(figsize=(10, 5))
    class_counts = y.sum().sort_values(ascending=False)
    sns.barplot(x=class_counts.index, y=class_counts.values, palette='viridis')
    plt.title('Toxicity Label Distribution in Dataset', fontsize=14, fontweight='bold')
    plt.xlabel('Toxicity Category', fontsize=12)
    plt.ylabel('Number of Samples', fontsize=12)
    plt.xticks(rotation=15)
    for i, count in enumerate(class_counts.values):
        plt.text(i, count + (max(class_counts.values) * 0.01), str(count), ha='center', fontweight='bold')
    plt.tight_layout()
    dist_path = os.path.join('reports', 'figures', 'class_distribution.png')
    plt.savefig(dist_path, dpi=300)
    plt.close()
    print(f"[INFO] Saved {dist_path}")
    
    # 2. Confusion Matrices Subplot
    mcm = multilabel_confusion_matrix(y_test, y_pred)
    fig, axes = plt.subplots(2, 3, figsize=(14, 9))
    axes = axes.ravel()
    
    for i, col in enumerate(TARGET_COLUMNS):
        cm = mcm[i]
        sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', ax=axes[i], cbar=False,
                    xticklabels=['Non-' + col, col],
                    yticklabels=['Non-' + col, col])
        axes[i].set_title(f'Confusion Matrix: {col}', fontsize=12, fontweight='bold')
        axes[i].set_xlabel('Predicted')
        axes[i].set_ylabel('Actual')
        
    plt.tight_layout()
    cm_path = os.path.join('reports', 'figures', 'confusion_matrices.png')
    plt.savefig(cm_path, dpi=300)
    plt.close()
    print(f"[INFO] Saved {cm_path}")
    
    # 3. Label Correlation Heatmap
    plt.figure(figsize=(8, 6))
    corr = y.corr()
    sns.heatmap(corr, annot=True, fmt='.2f', cmap='coolwarm', vmin=-1, vmax=1)
    plt.title('Label Correlation Heatmap', fontsize=14, fontweight='bold')
    plt.tight_layout()
    corr_path = os.path.join('reports', 'figures', 'label_correlation.png')
    plt.savefig(corr_path, dpi=300)
    plt.close()
    print(f"[INFO] Saved {corr_path}")
    
    # 4. Metrics Summary Bar Chart
    metrics_data = []
    for idx, col in enumerate(TARGET_COLUMNS):
        p = precision_score(y_test.iloc[:, idx], y_pred[:, idx], zero_division=0)
        r = recall_score(y_test.iloc[:, idx], y_pred[:, idx], zero_division=0)
        f1 = f1_score(y_test.iloc[:, idx], y_pred[:, idx], zero_division=0)
        metrics_data.append({'Category': col, 'Precision': p, 'Recall': r, 'F1-Score': f1})
        
    metrics_df = pd.DataFrame(metrics_data).melt(id_vars='Category', var_name='Metric', value_name='Score')
    
    plt.figure(figsize=(12, 6))
    sns.barplot(data=metrics_df, x='Category', y='Score', hue='Metric', palette='magma')
    plt.title('Per-Class Evaluation Metrics (Precision, Recall, F1)', fontsize=14, fontweight='bold')
    plt.ylim(0, 1.1)
    plt.legend(loc='lower right')
    plt.tight_layout()
    summary_path = os.path.join('reports', 'figures', 'metrics_summary.png')
    plt.savefig(summary_path, dpi=300)
    plt.close()
    print(f"[INFO] Saved {summary_path}")
    
    # Print Detailed Classification Report
    print("\n================ DETAILED CLASSIFICATION REPORT ================")
    print(classification_report(y_test, y_pred, target_names=TARGET_COLUMNS, zero_division=0))
    print("================================================================")
    print("Evaluation successfully completed!")

if __name__ == '__main__':
    evaluate_model()
