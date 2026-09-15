from fastapi import APIRouter, Depends, HTTPException, Query
import pickle
import os
import pandas as pd
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.models.assessment import AssessmentHistory
from app.models.user import User
from app.security import get_current_user
from app.schemas.assessment import HealthDataInput, ModelInsightsResponse, PredictionResponse
from app.services.action_plan import build_action_plan
from ml.evaluation import calculate_model_metrics
from ml.features import FEATURE_ORDER

router = APIRouter()

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, 'ml', 'model.pkl')
SCALER_PATH = os.path.join(BASE_DIR, 'ml', 'scaler.pkl')

model = None
scaler = None


def load_model_artifacts():
    global model, scaler
    if model is None or scaler is None:
        with open(MODEL_PATH, 'rb') as model_file:
            model = pickle.load(model_file)
        with open(SCALER_PATH, 'rb') as scaler_file:
            scaler = pickle.load(scaler_file)
        if getattr(model, 'n_features_in_', None) != len(FEATURE_ORDER):
            raise ValueError('Model feature count does not match the prediction feature order')
        if getattr(scaler, 'n_features_in_', None) != len(FEATURE_ORDER):
            raise ValueError('Scaler feature count does not match the prediction feature order')
        if 1 not in getattr(model, 'classes_', []):
            raise ValueError('Model does not contain the positive class')
    return model, scaler

@router.post("/predict", response_model=PredictionResponse)
def predict_risk(data: HealthDataInput, persist: bool = Query(True), user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        import shap

        model, scaler = load_model_artifacts()
        input_data = pd.DataFrame(
            [[getattr(data, feature) for feature in FEATURE_ORDER]],
            columns=FEATURE_ORDER,
        )
        
        input_scaled = scaler.transform(input_data)
        positive_class_index = list(model.classes_).index(1)
        probability = float(model.predict_proba(input_scaled)[0][positive_class_index] * 100)
        
        if probability < 33:
            category = "LOW"
        elif probability < 66:
            category = "MODERATE"
        else:
            category = "HIGH"
            
        explainer = shap.TreeExplainer(model)
        shap_vals = explainer.shap_values(input_scaled)
        
        shap_dict = {FEATURE_ORDER[i]: float(shap_vals[0][i]) for i in range(len(FEATURE_ORDER))}
        
        insights = []
        if data.trestbps > 130:
            insights.append("Your blood pressure is elevated. Consider monitoring it.")
        if data.chol > 200:
            insights.append("Cholesterol levels are above normal ranges.")
            
        action_plan = build_action_plan(data)

        if persist:
            assessment = AssessmentHistory(
                user_id=user.id,
                age=data.age,
                sex=data.sex,
                trestbps=data.trestbps,
                chol=data.chol,
                fbs=data.fbs,
                restecg=data.restecg,
                thalach=data.thalach,
                exang=data.exang,
                oldpeak=data.oldpeak,
                risk_probability=probability,
                risk_category=category,
            )
            db.add(assessment)
            db.commit()

        return PredictionResponse(
            risk_probability=probability,
            risk_category=category,
            shap_values=shap_dict,
            insights=insights,
            action_plan=action_plan,
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/history")
def assessment_history(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    records = db.query(AssessmentHistory).filter(AssessmentHistory.user_id == user.id).order_by(AssessmentHistory.created_at.desc()).all()
    return [
        {
            "id": record.id,
            "created_at": record.created_at,
            "risk_probability": record.risk_probability,
            "risk_category": record.risk_category,
            "form_data": {
                "age": record.age,
                "sex": record.sex,
                "trestbps": record.trestbps,
                "chol": record.chol,
                "fbs": record.fbs,
                "restecg": record.restecg,
                "thalach": record.thalach,
                "exang": record.exang,
                "oldpeak": record.oldpeak,
            },
            "action_plan": build_action_plan(record),
        }
        for record in records
    ]


@router.get("/model-insights", response_model=ModelInsightsResponse)
def model_insights(user: User = Depends(get_current_user)):
    try:
        return calculate_model_metrics()
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))