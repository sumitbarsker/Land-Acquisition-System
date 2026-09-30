import os
import joblib
import pandas as pd

from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report


# Load dataset
DATA_PATH = "dataset/land_data.csv"

df = pd.read_csv(DATA_PATH)

print("Dataset loaded successfully")
print("Total records:", len(df))


# Target column
target = "delay_risk"


# Features used by the model
features = [
    "district",
    "area_acres",
    "land_value_lakh",
    "verification_status",
    "legal_dispute",
    "compensation_status",
    "pending_days",
    "document_completeness",
    "ownership_clarity",
    "current_stage",
]


X = df[features]
y = df[target]


# Categorical and numerical columns
categorical_features = [
    "district",
    "verification_status",
    "compensation_status",
    "current_stage",
]

numerical_features = [
    "area_acres",
    "land_value_lakh",
    "legal_dispute",
    "pending_days",
    "document_completeness",
    "ownership_clarity",
]


# Preprocessing
preprocessor = ColumnTransformer(
    transformers=[
        (
            "categorical",
            OneHotEncoder(handle_unknown="ignore"),
            categorical_features,
        )
    ],
    remainder="passthrough",
)


# Random Forest model
model = RandomForestClassifier(
    n_estimators=200,
    random_state=42,
    class_weight="balanced",
)


# Complete ML pipeline
pipeline = Pipeline(
    steps=[
        ("preprocessor", preprocessor),
        ("model", model),
    ]
)


# Train-test split
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y,
)


print("Training records:", len(X_train))
print("Testing records:", len(X_test))


# Train model
pipeline.fit(X_train, y_train)


# Predictions
predictions = pipeline.predict(X_test)


# Evaluation
accuracy = accuracy_score(y_test, predictions)

print()
print("Model training completed")
print("Accuracy:", round(accuracy * 100, 2), "%")
print()
print("Classification Report:")
print(classification_report(y_test, predictions))


# Create model directory
os.makedirs("ml_model", exist_ok=True)


# Save model
model_path = "ml_model/delay_risk_model.pkl"

joblib.dump(pipeline, model_path)


print()
print("Model saved successfully:")
print(model_path)
