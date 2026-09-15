from typing import Literal

from pydantic import BaseModel, Field

from ml.features import TRAINING_RANGES

class HealthDataInput(BaseModel):
    age: int = Field(..., ge=1, le=120)
    sex: Literal[0, 1] = Field(..., description="0 for female, 1 for male")
    trestbps: int = Field(..., ge=TRAINING_RANGES["trestbps"][0], le=TRAINING_RANGES["trestbps"][1], description="Resting blood pressure")
    chol: int = Field(..., ge=TRAINING_RANGES["chol"][0], le=TRAINING_RANGES["chol"][1], description="Serum cholesterol in mg/dl")
    fbs: Literal[0, 1] = Field(..., description="Fasting blood sugar > 120 mg/dl (1 = true; 0 = false)")
    restecg: Literal[0, 1, 2] = Field(..., description="Resting electrocardiographic results (0, 1, 2)")
    thalach: int = Field(..., ge=TRAINING_RANGES["thalach"][0], le=TRAINING_RANGES["thalach"][1], description="Maximum heart rate achieved")
    exang: Literal[0, 1] = Field(..., description="Exercise induced angina (1 = yes; 0 = no)")
    oldpeak: float = Field(..., ge=TRAINING_RANGES["oldpeak"][0], le=TRAINING_RANGES["oldpeak"][1], description="ST depression induced by exercise relative to rest")

class PredictionResponse(BaseModel):
    risk_probability: float
    risk_category: str
    shap_values: dict
    insights: list