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
    with open(MODEL_PATH, "rb") as model_file:
        model = pickle.load(model_file)
    with open(SCALER_PATH, "rb") as scaler_file:
        scaler = pickle.load(scaler_file)

    data = pd.read_csv(DATA_PATH)
    features = data[list(FEATURE_ORDER)]
    target = data["target"]
    _, x_test, _, y_test = train_test_split(
        features,
        target,
        test_size=0.2,
        random_state=42,
    )
    probabilities = model.predict_proba(scaler.transform(x_test))[:, list(model.classes_).index(1)]
    predictions = (probabilities >= 0.5).astype(int)

    if hasattr(model, "feature_importances_"):
        importances = model.feature_importances_
    else:
        importances = permutation_importance(
            model,
            scaler.transform(x_test),
            y_test,
            scoring="roc_auc",
            random_state=42,
            n_repeats=10,
        ).importances_mean

    return {
        "evaluation_method": "Fixed 80/20 holdout split, random_state=42, using the serialized model and training scaler",
        "dataset": "Backend/ml/heart_2.csv",
        "test_samples": int(len(y_test)),
        "accuracy": float(accuracy_score(y_test, predictions)),
        "precision": float(precision_score(y_test, predictions, zero_division=0)),
        "recall": float(recall_score(y_test, predictions, zero_division=0)),
        "f1_score": float(f1_score(y_test, predictions, zero_division=0)),
        "roc_auc": float(roc_auc_score(y_test, probabilities)),
        "confusion_matrix": confusion_matrix(y_test, predictions).tolist(),
        "feature_importance": [
            {"feature": feature, "importance": float(importance)}
            for feature, importance in zip(FEATURE_ORDER, importances)
        ],
    }
