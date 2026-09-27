import pandas as pd


DATA_PATH = "dataset/land_data.csv"


df = pd.read_csv(DATA_PATH)


def calculate_risk(row):

    score = 0

    # Pending time
    if row["pending_days"] >= 30:
        score += 3
    elif row["pending_days"] >= 20:
        score += 2
    elif row["pending_days"] >= 10:
        score += 1

    # Compensation
    if row["compensation_status"] == "Pending":
        score += 2

    # Legal dispute
    if row["legal_dispute"] == 1:
        score += 3

    # Verification
    if row["verification_status"] != "Clear":
        score += 2

    # Documents
    if row["document_completeness"] < 60:
        score += 3
    elif row["document_completeness"] < 80:
        score += 1

    # Ownership clarity
    if row["ownership_clarity"] < 60:
        score += 3
    elif row["ownership_clarity"] < 80:
        score += 1

    # Current stage
    if row["current_stage"] == "Dispute Resolution":
        score += 2
    elif row["current_stage"] == "Compensation":
        score += 1

    if score >= 8:
        return 1

    return 0


df["delay_risk"] = df.apply(calculate_risk, axis=1)


df.to_csv(DATA_PATH, index=False)


print("Risk labels updated successfully!")
print()
print("New risk distribution:")
print(df["delay_risk"].value_counts())