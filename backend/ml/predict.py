import joblib
import pandas as pd


MODEL_PATH = "ml_model/delay_risk_model.pkl"

model = joblib.load(MODEL_PATH)


def predict_delay_risk(data):

    input_data = pd.DataFrame([data])

    prediction = model.predict(input_data)[0]

    probabilities = model.predict_proba(input_data)[0]

    risk_probability = probabilities[1] * 100

    if prediction == 1:
        risk = "High"
    else:
        risk = "Low"


    # Identify important risk factors
    risk_factors = []

    if data["pending_days"] >= 20:
        risk_factors.append(
            f"Case has been pending for {data['pending_days']} days"
        )

    if data["compensation_status"] == "Pending":
        risk_factors.append(
            "Compensation is still pending"
        )

    if data["document_completeness"] < 80:
        risk_factors.append(
            f"Document completeness is {data['document_completeness']}%"
        )

    if data["ownership_clarity"] < 80:
        risk_factors.append(
            f"Ownership clarity is {data['ownership_clarity']}%"
        )

    if data["legal_dispute"] == 1:
        risk_factors.append(
            "Legal dispute is reported"
        )

    if data["verification_status"] != "Clear":
        risk_factors.append(
            f"Verification status is {data['verification_status']}"
        )


    # Recommended actions
    recommended_actions = []

    if risk == "High":
        recommended_actions.append(
            "Prioritize this case for immediate review"
        )

    if data["pending_days"] >= 20:
        recommended_actions.append(
            "Review the reason for prolonged pending time"
        )

    if data["compensation_status"] == "Pending":
        recommended_actions.append(
            "Review pending compensation process"
        )

    if data["document_completeness"] < 80:
        recommended_actions.append(
            "Complete and verify missing documents"
        )

    if data["ownership_clarity"] < 80:
        recommended_actions.append(
            "Verify ownership details and supporting records"
        )

    if data["legal_dispute"] == 1:
        recommended_actions.append(
            "Send the case for legal review"
        )

    if len(recommended_actions) == 0:
        recommended_actions.append(
            "Continue regular monitoring of the case"
        )


    return {
        "prediction": int(prediction),
        "risk": risk,
        "risk_probability": round(risk_probability, 2),
        "risk_factors": risk_factors,
        "recommended_actions": recommended_actions
    }