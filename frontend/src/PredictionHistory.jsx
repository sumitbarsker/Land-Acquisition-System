import React, { useEffect, useState } from "react";
import axios from "axios";
import "./PredictionHistory.css";

function PredictionHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/predict/history")
      .then((response) => {
        setHistory(response.data.history);
      })
      .catch((error) => {
        console.error("Prediction history error:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="prediction-history-page">
        <h1>Prediction History</h1>
        <p>Loading prediction history...</p>
      </div>
    );
  }

  return (
    <div className="prediction-history-page">

      <div className="prediction-history-header">
        <div>
          <h1>Prediction History</h1>
          <p>
            Previous AI delay risk predictions
          </p>
        </div>

        <div className="history-count">
          Total Predictions: {history.length}
        </div>
      </div>


      <div className="history-table">

        <div className="history-table-head">
          <span>Land ID</span>
          <span>District</span>
          <span>Prediction</span>
          <span>Risk</span>
          <span>Probability</span>
          <span>Date</span>
        </div>


        {history.map((item) => (

          <div
            className="history-table-row"
            key={item.id}
          >

            <strong>
              {item.land_id || "Manual Entry"}
            </strong>

            <span>
              {item.district}
            </span>

            <span>
              {item.prediction}
            </span>

            <span
              className={`history-risk ${
                item.risk === "High"
                  ? "high"
                  : "low"
              }`}
            >
              {item.risk}
            </span>

            <span>
              {item.risk_probability}%
            </span>

            <span>
              {item.created_at || "Recent"}
            </span>

          </div>

        ))}


        {history.length === 0 && (

          <div className="history-empty">
            No prediction history available.
          </div>

        )}

      </div>

    </div>
  );
}

export default PredictionHistory;