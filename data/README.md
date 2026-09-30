# Jigsaw Toxic Comment Classification Dataset

This folder holds the dataset files used for training and evaluating the multi-label Toxic Comment Classifier.

## Dataset Structure

The standard dataset file should be named `train.csv` and placed in this directory (`data/train.csv`).

Required columns:
- `comment_text`: Raw string containing user comments.
- `toxic`: Binary indicator (0 or 1).
- `severe_toxic`: Binary indicator (0 or 1).
- `obscene`: Binary indicator (0 or 1).
- `threat`: Binary indicator (0 or 1).
- `insult`: Binary indicator (0 or 1).
- `identity_hate`: Binary indicator (0 or 1).

## Automatic Benchmark Dataset Generation / Downloading

If `data/train.csv` is not present when running `python -m ml.train`, the training script will automatically download or generate a balanced, realistic benchmark synthetic/sample Jigsaw dataset containing representative comments for each toxicity category.

To train on the full official Kaggle Jigsaw dataset:
1. Download `train.csv` from [Kaggle Toxic Comment Classification Challenge](https://www.kaggle.com/c/jigsaw-toxic-comment-classification-challenge/data).
2. Place `train.csv` inside this `data/` folder.
3. Run `python -m ml.train`.
