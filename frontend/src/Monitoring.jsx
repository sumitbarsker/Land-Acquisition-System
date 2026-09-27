import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  RefreshCw,
  Activity,
  CheckCircle,
  Clock,
  AlertTriangle,
  MapPin,
  TrendingUp,
} from "lucide-react";
import "./Monitoring.css";

function Monitoring({ onLandSelect }) {
  const [monitoring, setMonitoring] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadMonitoring = async () => {
    try {
      setLoading(true);
      setError("");

      const [monitoringResponse, alertsResponse] =
        await Promise.all([
          axios.get("http://127.0.0.1:8000/lands/monitoring"),
          axios.get("http://127.0.0.1:8000/lands/alerts"),
        ]);

      setMonitoring(monitoringResponse.data.monitoring || []);
      setAlerts(alertsResponse.data.alerts || []);
    } catch (error) {
      console.error("Monitoring error:", error);
      setError("Unable to load monitoring data from server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMonitoring();
  }, []);

  const completed = monitoring.filter(
    (item) => item.progress === 100
  ).length;

  const inProgress = monitoring.filter(
    (item) => item.progress < 100
  ).length;

  const highRisk = monitoring.filter(
    (item) => item.risk === "High"
  ).length;

  const mediumRisk = monitoring.filter(
    (item) => item.risk === "Medium"
  ).length;

  const lowRisk = monitoring.filter(
    (item) => item.risk === "Low"
  ).length;

  const averageProgress =
    monitoring.length > 0
      ? Math.round(
          monitoring.reduce(
            (total, item) => total + item.progress,
            0
          ) / monitoring.length
        )
      : 0;

  const getRiskClass = (risk) => {
    if (risk === "High") return "monitoring-risk high";
    if (risk === "Medium") return "monitoring-risk medium";

    return "monitoring-risk low";
  };

  const getProgressClass = (progress) => {
    if (progress === 100) return "completed";
    if (progress < 40) return "low-progress";

    return "normal-progress";
  };

  const handleLandClick = (landId) => {
    if (onLandSelect) {
      onLandSelect(landId);
    }
  };

  return (
    <div className="monitoring-page">

      {/* HEADER */}
      <div className="monitoring-header">
        <div>
          <h1>Land Acquisition Monitoring</h1>

          <p>
            Real-time monitoring of land acquisition
            progress, stages and risk levels
          </p>
        </div>

        <button
          className="monitoring-refresh"
          onClick={loadMonitoring}
          disabled={loading}
        >
          <RefreshCw
            size={16}
            className={loading ? "spin" : ""}
          />

          {loading ? "Refreshing..." : "Refresh Data"}
        </button>
      </div>

      {/* ERROR */}
      {error && (
        <div className="monitoring-error">
          <AlertTriangle size={18} />
          {error}
        </div>
      )}

      {/* SUMMARY */}
      <div className="monitoring-summary">

        <div className="monitoring-card">
          <div className="monitoring-card-icon blue">
            <Activity size={21} />
          </div>

          <div>
            <span>Total Cases</span>
            <strong>{monitoring.length}</strong>
          </div>
        </div>

        <div className="monitoring-card">
          <div className="monitoring-card-icon green">
            <CheckCircle size={21} />
          </div>

          <div>
            <span>Completed</span>
            <strong>{completed}</strong>
          </div>
        </div>

        <div className="monitoring-card">
          <div className="monitoring-card-icon orange">
            <Clock size={21} />
          </div>

          <div>
            <span>In Progress</span>
            <strong>{inProgress}</strong>
          </div>
        </div>

        <div className="monitoring-card">
          <div className="monitoring-card-icon red">
            <AlertTriangle size={21} />
          </div>

          <div>
            <span>High Risk</span>
            <strong>{highRisk}</strong>
          </div>
        </div>

        <div className="monitoring-card">
          <div className="monitoring-card-icon purple">
            <TrendingUp size={21} />
          </div>

          <div>
            <span>Average Progress</span>
            <strong>{averageProgress}%</strong>
          </div>
        </div>

      </div>

      {/* MAIN CONTENT */}
      <div className="monitoring-content">

        {/* CASE MONITORING */}
        <div className="monitoring-panel">

          <div className="monitoring-panel-header">
            <div>
              <h2>
                <Activity size={19} />
                Acquisition Progress
              </h2>

              <p>
                Current status of monitored land
                acquisition cases
              </p>
            </div>

            <span className="monitoring-count">
              {monitoring.length} Cases
            </span>
          </div>

          {loading ? (
            <div className="monitoring-loading">
              Loading monitoring data...
            </div>
          ) : monitoring.length === 0 ? (
            <div className="monitoring-empty">
              No monitoring records available.
            </div>
          ) : (
            <div className="monitoring-table-wrapper">

              <table className="monitoring-table">

                <thead>
                  <tr>
                    <th>Land ID</th>
                    <th>District</th>
                    <th>Progress</th>
                    <th>Current Stage</th>
                    <th>Pending Days</th>
                    <th>Risk</th>
                  </tr>
                </thead>

                <tbody>

                  {monitoring.map((item) => (
                    <tr key={item.id}>

                      <td>
                        <button
                          className="land-id-button"
                          onClick={() =>
                            handleLandClick(item.id)
                          }
                          title="Open this land record"
                        >
                          {item.id}
                        </button>
                      </td>

                      <td>
                        <span className="district-name">
                          <MapPin size={14} />
                          {item.district}
                        </span>
                      </td>

                      <td>
                        <div className="progress-container">

                          <div className="progress-top">
                            <span>
                              {item.progress}%
                            </span>
                          </div>

                          <div className="progress-bar">
                            <div
                              className={`progress-fill ${getProgressClass(
                                item.progress
                              )}`}
                              style={{
                                width: `${item.progress}%`,
                              }}
                            />
                          </div>

                        </div>
                      </td>

                      <td>
                        <span className="stage-badge">
                          {item.stage}
                        </span>
                      </td>

                      <td>
                        <span
                          className={
                            item.days >= 25
                              ? "days-danger"
                              : item.days > 0
                              ? "days-warning"
                              : "days-complete"
                          }
                        >
                          {item.days} days
                        </span>
                      </td>

                      <td>
                        <span
                          className={getRiskClass(
                            item.risk
                          )}
                        >
                          {item.risk}
                        </span>
                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>
          )}

        </div>

        {/* RISK OVERVIEW */}
        <div className="monitoring-panel risk-overview">

          <div className="monitoring-panel-header">

            <div>
              <h2>
                <AlertTriangle size={19} />
                Risk Overview
              </h2>

              <p>
                Current acquisition risk distribution
              </p>
            </div>

          </div>

          <div className="risk-overview-content">

            <div className="risk-overview-item">
              <div className="risk-overview-label">
                <span className="risk-dot high-dot"></span>
                <span>High Risk</span>
              </div>

              <strong>{highRisk}</strong>
            </div>

            <div className="risk-overview-item">
              <div className="risk-overview-label">
                <span className="risk-dot medium-dot"></span>
                <span>Medium Risk</span>
              </div>

              <strong>{mediumRisk}</strong>
            </div>

            <div className="risk-overview-item">
              <div className="risk-overview-label">
                <span className="risk-dot low-dot"></span>
                <span>Low Risk</span>
              </div>

              <strong>{lowRisk}</strong>
            </div>

          </div>

          <div className="average-progress-box">

            <div className="average-progress-header">
              <span>
                Overall Acquisition Progress
              </span>

              <strong>
                {averageProgress}%
              </strong>
            </div>

            <div className="large-progress-bar">
              <div
                className="large-progress-fill"
                style={{
                  width: `${averageProgress}%`,
                }}
              />
            </div>

          </div>

        </div>

      </div>

      {/* ALERTS */}
      <div className="monitoring-panel monitoring-alert-panel">

        <div className="monitoring-panel-header">

          <div>
            <h2>
              <AlertTriangle size={19} />
              Active Monitoring Alerts
            </h2>

            <p>
              Cases requiring attention based on
              monitoring data
            </p>
          </div>

          <span className="alert-total">
            {alerts.length} Active
          </span>

        </div>

        {alerts.length === 0 ? (

          <div className="monitoring-empty">
            No active monitoring alerts.
          </div>

        ) : (

          <div className="monitoring-alerts">

            {alerts.map((alert) => (

              <div
                className={`monitoring-alert ${alert.risk.toLowerCase()}`}
                key={alert.id}
              >

                <div className="monitoring-alert-icon">
                  <AlertTriangle size={19} />
                </div>

                <div className="monitoring-alert-content">

                  <div className="monitoring-alert-top">

                    <strong>
                      {alert.type}
                    </strong>

                    <span
                      className={getRiskClass(
                        alert.risk
                      )}
                    >
                      {alert.risk}
                    </span>

                  </div>

                  <button
                    className="alert-land-button"
                    onClick={() =>
                      handleLandClick(alert.id)
                    }
                  >
                    {alert.id} — {alert.district}
                  </button>

                  <p>
                    {alert.message}
                  </p>

                  <small>
                    Pending for {alert.days} days
                  </small>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}

export default Monitoring;