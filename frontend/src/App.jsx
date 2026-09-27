import { useEffect, useState } from "react";
import axios from "axios";
import RouteSurvey from "./RouteSurvey";

import AcquisitionManagement from "./AcquisitionManagement";
import Monitoring from "./Monitoring";
import Prediction from "./Prediction";
import PredictionHistory from "./PredictionHistory";
import Projects from "./Projects";
import DocumentVerification from "./DocumentVerification";
import PossessionManagement from "./PossessionManagement";


import {
  Map,
  MapPin,
  LandPlot,
  CheckCircle,
  Clock,
  AlertTriangle,
  IndianRupee,
  Search,
  ArrowLeft,
  Brain,
  History,
  FolderKanban,
  FileCheck,
  KeyRound,
} from "lucide-react";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";

import L from "leaflet";

import "leaflet/dist/leaflet.css";
import "./App.css";

/* ================================
   LEAFLET MARKER ICON
================================ */

const markerIcon = L.icon({
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",

  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",

  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

/* ================================
   MAP LOCATIONS
================================ */

const locations = [
  {
    land_id: "MP-BPL-001",
    district: "Bhopal",
    position: [23.2599, 77.4126],
    status: "Under Process",
  },

  {
    land_id: "MP-BPL-002",
    district: "Bhopal",
    position: [23.2715, 77.4360],
    status: "Acquired",
  },

  {
    land_id: "MP-SHR-001",
    district: "Sehore",
    position: [23.2050, 77.0850],
    status: "Disputed",
  },

  {
    land_id: "MP-RSN-001",
    district: "Raisen",
    position: [23.3315, 77.7818],
    status: "Acquired",
  },

  {
    land_id: "MP-IND-001",
    district: "Indore",
    position: [22.7196, 75.8577],
    status: "Under Process",
  },

  {
    land_id: "MP-JBL-001",
    district: "Jabalpur",
    position: [23.1815, 79.9864],
    status: "Acquired",
  },

  {
    land_id: "MP-VID-001",
    district: "Vidisha",
    position: [23.5251, 77.8081],
    status: "Under Process",
  },

  {
    land_id: "MP-HOS-001",
    district: "Hoshangabad",
    position: [22.7441, 77.7360],
    status: "Disputed",
  },

  {
    land_id: "MP-RAJ-001",
    district: "Rajgarh",
    position: [24.0000, 76.7300],
    status: "Acquired",
  },

  {
    land_id: "MP-BET-001",
    district: "Betul",
    position: [21.9045, 77.9020],
    status: "Under Process",
  },
];

function App() {
  const [dashboard, setDashboard] = useState(null);
  const [lands, setLands] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState("dashboard");
  const [selectedLand, setSelectedLand] = useState(null);
  const [search, setSearch] = useState("");

  /* ================================
     LOAD INITIAL DATA
  ================================= */

  useEffect(() => {
    loadDashboard();
    loadLands();
    loadAlerts();
  }, []);

  /* ================================
     DASHBOARD API
  ================================= */

  const loadDashboard = () => {
    axios
      .get("http://127.0.0.1:8000/dashboard/summary")

      .then((response) => {
        setDashboard(response.data);
      })

      .catch((error) => {
        console.error(
          "Dashboard API error:",
          error
        );
      })

      .finally(() => {
        setLoading(false);
      });
  };

  /* ================================
     LAND RECORDS API
  ================================= */

  const loadLands = () => {
    axios
      .get("http://127.0.0.1:8000/lands/")

      .then((response) => {
        setLands(response.data.lands || []);
      })

      .catch((error) => {
        console.error(
          "Land records API error:",
          error
        );
      });
  };

  /* ================================
     ALERTS API
  ================================= */

  const loadAlerts = () => {
    axios
      .get("http://127.0.0.1:8000/lands/alerts")

      .then((response) => {
        setAlerts(response.data.alerts || []);
      })

      .catch((error) => {
        console.error(
          "Alerts API error:",
          error
        );
      });
  };

  /* ================================
     LOADING SCREEN
  ================================= */

  if (loading || !dashboard) {
    return (
      <div className="loading">
        Loading dashboard...
      </div>
    );
  }

  /* ================================
     LAND SEARCH
  ================================= */

  const filteredLands = lands.filter((land) => {
    const text = search.toLowerCase();

    return (
      String(land.land_id || "")
        .toLowerCase()
        .includes(text) ||

      String(land.district || "")
        .toLowerCase()
        .includes(text) ||

      String(land.owner_name || "")
        .toLowerCase()
        .includes(text)
    );
  });

  return (
    <div className="app">

      {/* ================================
          SIDEBAR
      ================================= */}

      <aside className="sidebar">

        <div className="logo">
          <LandPlot size={28} />

          <span>
            LandGuard
          </span>
        </div>

        <nav>

          {/* DASHBOARD */}

          <a
            className={
              page === "dashboard"
                ? "active"
                : ""
            }

            onClick={() =>
              setPage("dashboard")
            }
          >
            <Map size={19} />

            Dashboard
          </a>

          {/* LAND RECORDS */}

          <a
            className={
              page === "lands"
                ? "active"
                : ""
            }

            onClick={() =>
              setPage("lands")
            }
          >
            <LandPlot size={19} />

            Land Records
          </a>

          {/* PROJECT PROPOSALS */}

          <a
            className={
              page === "projects"
                ? "active"
                : ""
            }

            onClick={() =>
              setPage("projects")
            }
          >
            <FolderKanban size={19} />

            Project Proposals
          </a>

          {/* DIGITAL SCRUTINY */}

          <a
            className={
              page === "scrutiny"
                ? "active"
                : ""
            }

            onClick={() =>
              setPage("scrutiny")
            }
          >
            <FileCheck size={19} />

            Digital Scrutiny
          </a>

          {/* ACQUISITION MANAGEMENT */}

          <a
            className={
              page === "acquisition"
                ? "active"
                : ""
            }

            onClick={() =>
              setPage("acquisition")
            }
          >
            <IndianRupee size={19} />

            Acquisition Management
          </a>

          {/* POSSESSION MANAGEMENT */}

          <a
            className={
              page === "possession"
                ? "active"
                : ""
            }

            onClick={() =>
              setPage("possession")
            }
          >
            <KeyRound size={19} />

            Possession Management
          </a>

          {/* ROUTE SURVEY */}

          <a
            className={
              page === "route-survey"
                ? "active"
                : ""
            }

            onClick={() =>
              setPage("route-survey")
            }
          >
            <MapPin size={19} />

            Route Survey
          </a>

          {/* MONITORING */}

          <a
            className={
              page === "monitoring"
                ? "active"
                : ""
            }

            onClick={() =>
              setPage("monitoring")
            }
          >
            <Clock size={19} />

            Monitoring
          </a>

          {/* ALERTS */}

          <a
            className={
              page === "alerts"
                ? "active"
                : ""
            }

            onClick={() =>
              setPage("alerts")
            }
          >
            <AlertTriangle size={19} />

            Alerts

            {alerts.length > 0 && (
              <span className="alert-count">
                {alerts.length}
              </span>
            )}
          </a>

          {/* AI RISK PREDICTION */}

          <a
            className={
              page === "prediction"
                ? "active"
                : ""
            }

            onClick={() =>
              setPage("prediction")
            }
          >
            <Brain size={19} />

            AI Risk Prediction
          </a>

          {/* PREDICTION HISTORY */}

          <a
            className={
              page === "prediction-history"
                ? "active"
                : ""
            }

            onClick={() =>
              setPage("prediction-history")
            }
          >
            <History size={19} />

            Prediction History
          </a>

        </nav>

        <div className="sidebar-bottom">

          <span>
            National Land Acquisition
          </span>

          <small>
            Management System
          </small>

        </div>

      </aside>

      {/* ================================
          MAIN CONTENT
      ================================= */}

      <main className="main-content">

        {/* ================================
            DASHBOARD
        ================================= */}

        {page === "dashboard" && (
          <>

            <header className="topbar">

              <div>

                <h1>
                  Land Acquisition Dashboard
                </h1>

                <p>
                  Real-time monitoring and decision support
                </p>

              </div>

              <div className="status">

                <span></span>

                System Online

              </div>

            </header>

            {/* STATS */}

            <section className="stats-grid">

              <div className="stat-card">

                <div className="stat-icon">
                  <LandPlot size={22} />
                </div>

                <div>

                  <p>
                    Total Land Records
                  </p>

                  <h2>
                    {dashboard.total_land_records}
                  </h2>

                </div>

              </div>

              <div className="stat-card">

                <div className="stat-icon">
                  <Map size={22} />
                </div>

                <div>

                  <p>
                    Total Area
                  </p>

                  <h2>
                    {dashboard.total_area_acres} Acres
                  </h2>

                </div>

              </div>

              <div className="stat-card">

                <div className="stat-icon">
                  <CheckCircle size={22} />
                </div>

                <div>

                  <p>
                    Acquired
                  </p>

                  <h2>
                    {dashboard.acquired}
                  </h2>

                </div>

              </div>

              <div className="stat-card">

                <div className="stat-icon">
                  <Clock size={22} />
                </div>

                <div>

                  <p>
                    Under Process
                  </p>

                  <h2>
                    {dashboard.under_process}
                  </h2>

                </div>

              </div>

              <div className="stat-card">

                <div className="stat-icon">
                  <AlertTriangle size={22} />
                </div>

                <div>

                  <p>
                    Disputed
                  </p>

                  <h2>
                    {dashboard.disputed}
                  </h2>

                </div>

              </div>

              <div className="stat-card">

                <div className="stat-icon">
                  <IndianRupee size={22} />
                </div>

                <div>

                  <p>
                    Compensation Pending
                  </p>

                  <h2>
                    {dashboard.compensation_pending}
                  </h2>

                </div>

              </div>

            </section>

            {/* MAP + STATUS */}

            <section className="content-grid">

              <div className="panel map-panel">

                <div className="panel-header">

                  <div>

                    <h2>
                      Land Acquisition Map
                    </h2>

                    <p>
                      Geographical monitoring overview
                    </p>

                  </div>

                </div>

                <div className="real-map">

                  <MapContainer
                    center={[23.5, 78.0]}
                    zoom={6}
                    scrollWheelZoom={true}
                    className="land-map"
                  >

                    {/* SATELLITE MAP */}

                    <TileLayer
                      attribution="&copy; OpenStreetMap contributors"
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {locations.map((land) => (

                      <Marker
                        key={land.land_id}
                        position={land.position}
                        icon={markerIcon}
                      >

                        <Popup>

                          <strong>
                            {land.land_id}
                          </strong>

                          <br />

                          District: {land.district}

                          <br />

                          Status: {land.status}

                        </Popup>

                      </Marker>

                    ))}

                  </MapContainer>

                </div>

              </div>

              {/* ACQUISITION STATUS */}

              <div className="panel">

                <div className="panel-header">

                  <div>

                    <h2>
                      Acquisition Status
                    </h2>

                    <p>
                      Current land record distribution
                    </p>

                  </div>

                </div>

                <div className="status-list">

                  <div>

                    <span>
                      Acquired
                    </span>

                    <strong>
                      {dashboard.acquired}
                    </strong>

                  </div>

                  <div>

                    <span>
                      Under Process
                    </span>

                    <strong>
                      {dashboard.under_process}
                    </strong>

                  </div>

                  <div>

                    <span>
                      Disputed
                    </span>

                    <strong>
                      {dashboard.disputed}
                    </strong>

                  </div>

                  <div>

                    <span>
                      Compensation Pending
                    </span>

                    <strong>
                      {dashboard.compensation_pending}
                    </strong>

                  </div>

                </div>

              </div>

            </section>

          </>
        )}

        {/* ================================
            LAND RECORDS
        ================================= */}

        {page === "lands" && (

          <div className="records-page">

            <header className="records-header">

              <div>

                <button
                  className="back-button"
                  onClick={() =>
                    setPage("dashboard")
                  }
                >

                  <ArrowLeft size={18} />

                  Dashboard

                </button>

                <h1>
                  Land Records
                </h1>

                <p>
                  Manage and monitor all land acquisition records
                </p>

              </div>

            </header>

            <div className="records-toolbar">

              <div className="search-box">

                <Search size={19} />

                <input
                  type="text"
                  placeholder="Search Land ID, district or owner..."
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                />

              </div>

              <div className="record-count">

                {filteredLands.length} Records

              </div>

            </div>

            <div className="table-panel">

              <table>

                <thead>

                  <tr>

                    <th>
                      Land ID
                    </th>

                    <th>
                      District
                    </th>

                    <th>
                      Owner
                    </th>

                    <th>
                      Area
                    </th>

                    <th>
                      Status
                    </th>

                    <th>
                      Compensation
                    </th>

                    <th>
                      Details
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {filteredLands.map((land) => (

                    <tr key={land.land_id}>

                      <td>

                        <strong>
                          {land.land_id}
                        </strong>

                      </td>

                      <td>
                        {land.district}
                      </td>

                      <td>
                        {land.owner_name}
                      </td>

                      <td>
                        {land.area_acres} Acres
                      </td>

                      <td>

                        <span
                          className={`status-badge ${
                            String(land.status || "")
                              .toLowerCase()
                              .replace(/\s+/g, "-")
                          }`}
                        >

                          {land.status}

                        </span>

                      </td>

                      <td>

                        <span
                          className={`compensation-badge ${
                            String(
                              land.compensation_status || ""
                            ).toLowerCase()
                          }`}
                        >

                          {land.compensation_status}

                        </span>

                      </td>

                      <td>
                        <button
                          className="view-details-btn"
                          onClick={() => setSelectedLand(land)}
                        >
                          View Details
                        </button>
                      </td>


                    </tr>

                  ))}

                  {filteredLands.length === 0 && (

                    <tr>

                      <td
                        colSpan="6"
                        className="no-records"
                      >

                        No land records found.

                      </td>

                    </tr>

                  )}

                </tbody>

              </table>

            </div>

          </div>

        )}

        {/* ================================
            PROJECT PROPOSALS
        ================================= */}

        {page === "projects" && (
          <Projects />
        )}

        {/* ================================
            DIGITAL SCRUTINY
        ================================= */}

        {page === "scrutiny" && (
          <DocumentVerification />
        )}

        {/* ================================
            ACQUISITION MANAGEMENT
        ================================= */}

        {page === "acquisition" && (
          <AcquisitionManagement />
        )}

        {/* ================================
            POSSESSION MANAGEMENT
        ================================= */}

        {page === "possession" && (
          <PossessionManagement />
        )}

        {/* ================================
            MONITORING
        ================================= */}

        {page === "monitoring" && (
          <Monitoring />
        )}

        {/* ================================
            ALERTS
        ================================= */}

        {page === "alerts" && (

          <div className="records-page">

            <header className="records-header">

              <div>

                <button
                  className="back-button"
                  onClick={() =>
                    setPage("dashboard")
                  }
                >

                  <ArrowLeft size={18} />

                  Dashboard

                </button>

                <h1>
                  Alerts
                </h1>

                <p>
                  Important land acquisition alerts and notifications
                </p>

              </div>

            </header>

            <div className="panel">

              <div className="panel-header">

                <div>

                  <h2>
                    Current Alerts
                  </h2>

                  <p>
                    Automatically generated from monitoring data
                  </p>

                </div>

              </div>

              <div className="alerts-list">

                {alerts.map((alert) => (

                  <div
                    className={`alert-item ${
                      String(alert.risk || "")
                        .toLowerCase()
                    }`}
                    key={alert.id}
                  >

                    <div className="alert-icon">

                      <AlertTriangle size={22} />

                    </div>

                    <div className="alert-content">

                      <div className="alert-top">

                        <strong>
                          {alert.type}
                        </strong>

                        <span className="alert-risk">
                          {alert.risk}
                        </span>

                      </div>

                      <h3>
                        {alert.id} â€” {alert.district}
                      </h3>

                      <p>
                        {alert.message}
                      </p>

                      <small>
                        Pending for {alert.days} days
                      </small>

                    </div>

                  </div>

                ))}

                {alerts.length === 0 && (

                  <div className="no-records">

                    No active alerts.

                  </div>

                )}

              </div>

            </div>

          </div>

        )}

        {/* ================================
            AI RISK PREDICTION
        ================================= */}

        {page === "prediction" && (
          <Prediction />
        )}

        {/* ================================
            PREDICTION HISTORY
        ================================= */}

        {page === "prediction-history" && (
          <PredictionHistory />
        )}

        {/* ================================
            ROUTE SURVEY
        ================================= */}

        {page === "route-survey" && (
          <RouteSurvey />
        )}

        {selectedLand && (
          <div
            className="ownership-modal-overlay"
            onClick={() => setSelectedLand(null)}
          >
            <div
              className="ownership-modal"
              onClick={(e) => e.stopPropagation()}
            >

              <div className="ownership-modal-header">
                <div>
                  <h2>Land Ownership Details</h2>
                  <p>{selectedLand.land_id}</p>
                </div>

                <button
                  className="modal-close-btn"
                  onClick={() => setSelectedLand(null)}
                >
                  ×
                </button>
              </div>

              <div className="ownership-details-grid">

                <div className="ownership-detail-card">
                  <span>Owner Name</span>
                  <strong>{selectedLand.owner_name || "Not Available"}</strong>
                </div>

                <div className="ownership-detail-card">
                  <span>Khasra Number</span>
                  <strong>{selectedLand.khasra_number || "Not Available"}</strong>
                </div>

                <div className="ownership-detail-card">
                  <span>Village</span>
                  <strong>{selectedLand.village || "Not Available"}</strong>
                </div>

                <div className="ownership-detail-card">
                  <span>Tehsil</span>
                  <strong>{selectedLand.tehsil || "Not Available"}</strong>
                </div>

                <div className="ownership-detail-card">
                  <span>District</span>
                  <strong>{selectedLand.district || "Not Available"}</strong>
                </div>

                <div className="ownership-detail-card">
                  <span>Land Area</span>
                  <strong>{selectedLand.area_acres || 0} Acres</strong>
                </div>

                <div className="ownership-detail-card">
                  <span>Ownership Type</span>
                  <strong>{selectedLand.ownership_type || "Individual"}</strong>
                </div>

                <div className="ownership-detail-card">
                  <span>Acquisition Status</span>
                  <strong>{selectedLand.status || "Not Available"}</strong>
                </div>

                <div className="ownership-detail-card">
                  <span>Compensation</span>
                  <strong>{selectedLand.compensation_status || "Not Available"}</strong>
                </div>

              </div>

              <div className="ownership-modal-footer">
                <span>
                  Ownership information from registered land records
                </span>

                <button
                  className="modal-done-btn"
                  onClick={() => setSelectedLand(null)}
                >
                  Close
                </button>
              </div>

            </div>
          </div>
        )}
      </main>

    </div>
  );
}

export default App;


















