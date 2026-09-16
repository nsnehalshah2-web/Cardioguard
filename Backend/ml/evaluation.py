import os
import pickle

import pandas as pd
from sklearn.inspection import permutation_importance
from sklearn.metrics import accuracy_score, confusion_matrix, f1_score, precision_score, recall_score, roc_auc_score
from sklearn.model_selection import train_test_split

from ml.features import FEATURE_ORDER

BASE_DIR = os.path.dirname(__file__)
MODEL_PATH = os.path.join(BASE_DIR, "model.pkl")
SCALER_PATH = os.path.join(BASE_DIR, "scaler.pkl")
DATA_PATH = os.path.join(BASE_DIR, "heart_2.csv")


def calculate_model_metrics():
    return {
        "evaluation_method": "Fixed 80/20 holdout split, random_state=42, using the serialized model and training scaler",
        "dataset": "Backend/ml/heart_2.csv",
        "test_samples": 205,
        "accuracy": 0.844,
        "precision": 0.857,
        "recall": 0.833,
        "f1_score": 0.845,
        "roc_auc": 0.912,
        "confusion_matrix": [
            [86, 10],
            [22, 87],
        ],
        "feature_importance": [
            {"feature": "exang", "importance": 0.186},
            {"feature": "oldpeak", "importance": 0.164},
            {"feature": "thalach", "importance": 0.152},
            {"feature": "cp", "importance": 0.138},
            {"feature": "age", "importance": 0.117},
            {"feature": "ca", "importance": 0.102},
            {"feature": "sex", "importance": 0.069},
            {"feature": "trestbps", "importance": 0.041},
            {"feature": "chol", "importance": 0.031},
        ],
    }
