import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Prediction.css";
import { API_BASE_URL } from "./api";

function Prediction() {
  const [lands, setLands] = useState([]);
  const [selectedLand, setSelectedLand] = useState("");

  const [formData, setFormData] = useState({
    land_id: "",
    district: "Bhopal",
    area_acres: 3.5,
    land_value_lakh: 30,
    verification_status: "Clear",
    legal_dispute: 0,
    compensation_status: "Pending",
    pending_days: 25,
    document_completeness: 70,
    ownership_clarity: 65,
    current_stage: "Verification",
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingLands, setLoadingLands] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/lands/`)
      .then((response) => {
        console.log("Land records:", response.data);
        setLands(response.data.lands || []);
      })
      .catch((err) => {
        console.error("Land records error:", err);
        setError("Unable to load land records.");
      })
      .finally(() => {
        setLoadingLands(false);
      });
  }, []);

  const handleLandSelect = (e) => {
    const landId = e.target.value;

    setSelectedLand(landId);
    setResult(null);
    setError("");

    const land = lands.find((item) => item.land_id === landId);

    if (!land) {
      setFormData({
        land_id: "",
        district: "Bhopal",
        area_acres: 3.5,
        land_value_lakh: 30,
        verification_status: "Clear",
        legal_dispute: 0,
        compensation_status: "Pending",
        pending_days: 25,
        document_completeness: 70,
        ownership_clarity: 65,
        current_stage: "Verification",
      });

      return;
    }

    setFormData({
      land_id: land.land_id || "",
      district: land.district || "Bhopal",
      area_acres: Number(land.area_acres ?? 3.5),
      land_value_lakh: Number(land.land_value_lakh ?? 30),
      verification_status: land.verification_status || "Clear",
      legal_dispute: Number(land.legal_dispute ?? 0),
      compensation_status: land.compensation_status || "Pending",
      pending_days: Number(land.pending_days ?? 25),
      document_completeness: Number(
        land.document_completeness ?? 70
      ),
      ownership_clarity: Number(
        land.ownership_clarity ?? 65
      ),
      current_stage: land.current_stage || "Verification",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    const numericFields = [
      "area_acres",
      "land_value_lakh",
      "legal_dispute",
      "pending_days",
      "document_completeness",
      "ownership_clarity",
    ];

    setFormData((prev) => ({
      ...prev,
      [name]: numericFields.includes(name)
        ? Number(value)
        : value,
    }));
  };

  const predictRisk = async () => {
    setLoading(true);
    setResult(null);
    setError("");

    try {
      const response = await axios.post(
        `${API_BASE_URL}/predict/risk`,
        formData
      );

      console.log("Prediction response:", response.data);

      setResult(response.data.risk_prediction);
    } catch (err) {
      console.error("Prediction error:", err);

      if (err.response) {
        console.error(
          "Backend response:",
          err.response.data
        );
      }

      setError(
        "Unable to connect with ML prediction service."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="prediction-page">

      <div className="prediction-header">
        <div>
          <h1>AI Delay Risk Prediction</h1>

          <p>
            Analyze a land acquisition case using the
            machine learning model
          </p>
        </div>

        <div className="ai-status">
          <span></span>
          AI Model Online
        </div>
      </div>

      <div className="prediction-layout">

        {/* LAND CASE FORM */}

        <div className="prediction-form">

          <h2>Land Case Details</h2>

          <p className="form-subtitle">
            Select an existing land record or enter case
            details manually.
          </p>

          <div className="form-group land-selector">

            <label>
              Select Existing Land Record
            </label>

            <select
              value={selectedLand}
              onChange={handleLandSelect}
              disabled={loadingLands}
            >
              <option value="">
                {loadingLands
                  ? "Loading land records..."
                  : "Select a land record"}
              </option>

              {lands.map((land) => (
                <option
                  key={land.land_id}
                  value={land.land_id}
                >
                  {land.land_id} - {land.district}
                </option>
              ))}
            </select>

          </div>

          <div className="form-grid">

            <div className="form-group">
              <label>District</label>

              <input
                name="district"
                value={formData.district}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Area (Acres)</label>

              <input
                type="number"
                step="0.1"
                name="area_acres"
                value={formData.area_acres}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Land Value (Lakh)</label>

              <input
                type="number"
                name="land_value_lakh"
                value={formData.land_value_lakh}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Verification Status</label>

              <select
                name="verification_status"
                value={formData.verification_status}
                onChange={handleChange}
              >
                <option value="Clear">
                  Clear
                </option>

                <option value="Pending">
                  Pending
                </option>

                <option value="Disputed">
                  Disputed
                </option>
              </select>
            </div>

            <div className="form-group">
              <label>Legal Dispute</label>

              <select
                name="legal_dispute"
                value={formData.legal_dispute}
                onChange={handleChange}
              >
                <option value={0}>
                  No
                </option>

                <option value={1}>
                  Yes
                </option>
              </select>
            </div>

            <div className="form-group">
              <label>Compensation Status</label>

              <select
                name="compensation_status"
                value={formData.compensation_status}
                onChange={handleChange}
              >
                <option value="Paid">
                  Paid
                </option>

                <option value="Pending">
                  Pending
                </option>
              </select>
            </div>

            <div className="form-group">
              <label>Pending Days</label>

              <input
                type="number"
                name="pending_days"
                value={formData.pending_days}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>
                Document Completeness (%)
              </label>

              <input
                type="number"
                name="document_completeness"
                min="0"
                max="100"
                value={formData.document_completeness}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>
                Ownership Clarity (%)
              </label>

              <input
                type="number"
                name="ownership_clarity"
                min="0"
                max="100"
                value={formData.ownership_clarity}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Current Stage</label>

              <select
                name="current_stage"
                value={formData.current_stage}
                onChange={handleChange}
              >
                <option value="Verification">
                  Verification
                </option>

                <option value="Valuation">
                  Valuation
                </option>

                <option value="Compensation">
                  Compensation
                </option>

                <option value="Dispute Resolution">
                  Dispute Resolution
                </option>

                <option value="Completed">
                  Completed
                </option>
              </select>
            </div>

          </div>

          <button
            className="predict-button"
            onClick={predictRisk}
            disabled={loading}
          >
            {loading
              ? "Analyzing..."
              : "Predict Delay Risk"}
          </button>

        </div>

        {/* AI RESULT */}

        <div className="prediction-result">

          <h2>AI Prediction</h2>

          <div className="model-info">

            <h3>Model Information</h3>

            <div className="model-info-grid">

              <div className="model-info-item">
                <span>Algorithm</span>
                <strong>Random Forest</strong>
              </div>

              <div className="model-info-item">
                <span>Total Dataset</span>
                <strong>300 Records</strong>
              </div>

              <div className="model-info-item">
                <span>Training / Testing</span>
                <strong>240 / 60</strong>
              </div>

              <div className="model-info-item">
                <span>Features Used</span>
                <strong>10</strong>
              </div>

            </div>

          </div>

          {!result && !loading && !error && (
            <div className="result-placeholder">

              <div className="prediction-symbol">
                AI
              </div>

              <h3>Ready for Analysis</h3>

              <p>
                Select a land record or enter the case
                details and run the AI prediction.
              </p>

            </div>
          )}

          {loading && (
            <div className="result-placeholder">

              <div className="prediction-symbol">
                ...
              </div>

              <h3>Analyzing Case</h3>

              <p>
                Machine learning model is evaluating the
                land acquisition details.
              </p>

            </div>
          )}

          {error && (
            <div className="prediction-error">
              {error}
            </div>
          )}

          {result && (
            <div
              className={`risk-result ${
                result.risk === "High"
                  ? "high-risk"
                  : "low-risk"
              }`}
            >

              <div className="risk-label">
                {result.risk === "High"
                  ? "HIGH DELAY RISK"
                  : "LOW DELAY RISK"}
              </div>

              <div className="risk-value">
                {result.risk}
              </div>

              <p>
                The ML model has classified this land
                acquisition case as{" "}
                <strong>
                  {result.risk}
                </strong>{" "}
                delay risk.
              </p>

              <div className="prediction-number">
                Model Prediction: {result.prediction}
              </div>

              <div className="risk-probability-bar">

                <div className="risk-probability-header">

                  <span>
                    Risk Probability
                  </span>

                  <strong>
                    {result.risk_probability}%
                  </strong>

                </div>

                <div className="risk-probability-track">

                  <div
                    className="risk-probability-fill"
                    style={{
                      width: `${result.risk_probability}%`,
                    }}
                  ></div>

                </div>

              </div>

              {result.risk_factors &&
                result.risk_factors.length > 0 && (
                  <div className="risk-factors">

                    <h3>Risk Factors</h3>

                    <ul>
                      {result.risk_factors.map(
                        (factor, index) => (
                          <li key={index}>
                            {factor}
                          </li>
                        )
                      )}
                    </ul>

                  </div>
                )}

              {result.recommended_actions &&
                result.recommended_actions.length > 0 && (
                  <div className="recommended-actions">

                    <h3>
                      Recommended Actions
                    </h3>

                    <ul>
                      {result.recommended_actions.map(
                        (action, index) => (
                          <li key={index}>
                            {action}
                          </li>
                        )
                      )}
                    </ul>

                  </div>
                )}

            </div>
          )}

        </div>

      </div>

    </div>
  );
}

export default Prediction;