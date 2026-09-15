def build_action_plan(data):
    actions = []

    trestbps = getattr(data, "trestbps", None)
    if trestbps is not None and trestbps > 130:
        actions.append({
            "title": "Focus on blood pressure",
            "detail": "Discuss repeated elevated readings with a qualified clinician.",
            "signal": "trestbps",
        })

    chol = getattr(data, "chol", None)
    if chol is not None and chol > 200:
        actions.append({
            "title": "Review cholesterol",
            "detail": "Consider discussing your lipid results with a qualified clinician.",
            "signal": "chol",
        })

    fbs = getattr(data, "fbs", None)
    if fbs is not None and fbs == 1:
        actions.append({
            "title": "Review fasting blood sugar",
            "detail": "Ask a qualified clinician how this reading fits your broader health picture.",
            "signal": "fbs",
        })

    exang = getattr(data, "exang", None)
    if exang is not None and exang == 1:
        actions.append({
            "title": "Discuss exercise-related symptoms",
            "detail": "Share exercise-related discomfort with a qualified clinician before changing activity.",
            "signal": "exang",
        })

    oldpeak = getattr(data, "oldpeak", None)
    if oldpeak is not None and oldpeak > 2:
        actions.append({
            "title": "Review exercise-test context",
            "detail": "Ask a qualified clinician to interpret this exercise-test signal in context.",
            "signal": "oldpeak",
        })

    thalach = getattr(data, "thalach", None)
    if thalach is not None and thalach < 100:
        actions.append({
            "title": "Discuss exercise response",
            "detail": "Ask a qualified clinician what this maximum heart-rate reading means for you.",
            "signal": "thalach",
        })

    if not actions:
        actions.append({
            "title": "Keep tracking your signals",
            "detail": "Continue recording readings consistently and bring questions to a qualified clinician.",
            "signal": None,
        })

    return actions[:4]
