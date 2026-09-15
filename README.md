# 🫀 CardioGuard

### AI-Powered Cardiovascular Risk Assessment & Health Intelligence Platform

CardioGuard is an AI-powered web application designed to estimate cardiovascular disease risk using clinical health parameters and provide personalized, explainable health insights.

The platform combines machine learning-based risk prediction with a modern web interface, authentication, assessment history, and health recommendations.

---

## 🚀 Live Demo

### Frontend
https://cardioguard-gyud.onrender.com/

### Backend API
https://cardioguard-api-noup.onrender.com/

---

## 📌 Features

- 🫀 **Cardiovascular Risk Prediction**
- 🤖 **Machine Learning-based assessment**
- 📊 **Risk percentage and risk classification**
- 🧠 **Explainable health insights**
- 👤 **User authentication**
- 🔐 **JWT-based authentication**
- 📝 **Personal health assessments**
- 📚 **Assessment history**
- 📈 **Health risk visualization**
- 💡 **Personalized recommendations**
- 🌐 **Responsive web interface**
- ⚡ **FastAPI backend**
- ⚛️ **React + Vite frontend**

---

## 🏗️ System Architecture

```text
                    ┌──────────────────────┐
                    │      User            │
                    │  Web Browser         │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │   React Frontend     │
                    │      + Vite          │
                    └──────────┬───────────┘
                               │
                         REST API / HTTPS
                               │
                               ▼
                    ┌──────────────────────┐
                    │    FastAPI Backend   │
                    │      Python          │
                    └──────────┬───────────┘
                               │
                    ┌──────────┴──────────┐
                    ▼                     ▼
          ┌──────────────────┐   ┌──────────────────┐
          │ Machine Learning │   │ Authentication   │
          │ Prediction Model │   │   & User Data    │
          └────────┬─────────┘   └────────┬─────────┘
                   │                      │
                   └──────────┬───────────┘
                              ▼
                    ┌──────────────────────┐
                    │      Database        │
                    │ Assessment History   │
                    └──────────────────────┘
