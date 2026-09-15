# 🫀 CardioGuard

### AI-Powered Cardiovascular Risk Assessment & Health Intelligence Platform

CardioGuard is an AI-powered web application designed to estimate cardiovascular disease risk using clinical health parameters and provide personalized, explainable health insights.

The platform combines **Machine Learning, risk prediction, What-If analysis, authentication, assessment history, and health insights** in a modern web interface.

---

## 🌐 Live Demo

**https://nsnehalshah2-web.github.io/Cardioguard/**

## 🚀 Features

- 🩺 Cardiovascular Risk Prediction
- 🔬 What-If Risk Simulation
- 📊 Model Insights & Explainable AI
- 🔐 User Authentication & Password Reset
- 📋 Assessment History
- ⚠️ Input Validation
- 📱 Responsive Web Interface

---

## 🧠 System Workflow

```mermaid
flowchart LR
    A[User] --> B[React Frontend]
    B --> C[FastAPI Backend]
    C --> D[Input Validation]
    D --> E[StandardScaler]
    E --> F[XGBoost Model]
    F --> G[Risk Prediction]
    G --> B
🔬 What-If Analysis
🧠 Machine Learning Model

CardioGuard uses an XGBoost classifier with 9 clinical features:

Age • Sex • Blood Pressure • Cholesterol • FBS • Resting ECG • Max Heart Rate • Exercise Angina • Oldpeak

Clinical Inputs
      ↓
Data Validation
      ↓
Feature Scaling
      ↓
XGBoost Classifier
      ↓
Risk Probability
      ↓
CardioGuard Dashboard
🛠️ Tech Stack
Frontend: React, Vite, JavaScript
Backend: Python, FastAPI
Machine Learning: XGBoost, Scikit-learn
Data Processing: Pandas, NumPy
Database: SQLite
Deployment: GitHub Pages + Render
👩‍💻 Author

Nehal Shah
Computer Science Engineering

⚠️ Disclaimer

CardioGuard is an educational and research project. It does not provide medical diagnosis and should not replace professional medical advice.
