import { useState } from "react";
import axios from "axios";
import MapView from "./MapView";
import { API_BASE_URL } from "./api";

function RouteSurvey() {
  const [start, setStart] = useState("Bhopal");
  const [end, setEnd] = useState("Raisen");
  const [corridor, setCorridor] = useState(5);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const analyzeRoute = async () => {
    if (!start.trim() || !end.trim()) {
      setError("Starting point aur destination dono enter karo.");
      return;
    }

    if (Number(corridor) <= 0) {
      setError("Corridor width 0 se greater hona chahiye.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.get(
        `${API_BASE_URL}/route-survey/corridor`,
        {
          params: {
            start: start.trim(),
            end: end.trim(),
            corridor_km: Number(corridor),
          },
        }
      );

      if (response.data?.error) {
        setResult(null);
        setError(response.data.error);
        return;
      }

      setResult(response.data);
    } catch (err) {
      console.error("Route Survey Error:", err);

      setResult(null);
      setError(
        "Route survey data load nahi ho pa raha. Backend check karo."
      );
    } finally {
      setLoading(false);
    }
  };

  const summary = result?.summary;

  return (
    <div className="route-survey-page">
      <div className="page-header">
        <div>
          <h1>Route Survey</h1>

          <p>
            Road corridor ke andar affected land parcels aur ownership
            details identify karein.
          </p>
        </div>
      </div>

      {/* ROUTE SEARCH */}
      <div className="route-search-card">
        <div className="route-field">
          <label>Starting Point</label>

          <input
            value={start}
            onChange={(e) => setStart(e.target.value)}
            placeholder="Bhopal"
          />
        </div>

        <div className="route-arrow">→</div>

        <div className="route-field">
          <label>Destination</label>

          <input
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            placeholder="Raisen"
          />
        </div>

        <div className="route-field">
          <label>Corridor Width (KM)</label>

          <input
            type="number"
            min="0.1"
            step="0.1"
            value={corridor}
            onChange={(e) => setCorridor(e.target.value)}
          />
        </div>

        <button
          className="analyze-route-btn"
          onClick={analyzeRoute}
          disabled={loading}
        >
          {loading ? "Analyzing..." : "Analyze Route"}
        </button>
      </div>

      {/* ERROR */}
      {error && <div className="route-error">{error}</div>}

      {/* RESULT */}
      {result && summary && (
        <>
          {/* ROUTE SUMMARY */}
          <div className="route-summary">
            <div className="route-summary-card">
              <span>Route</span>

              <strong>
                {result.route.start} → {result.route.end}
              </strong>
            </div>

            <div className="route-summary-card">
              <span>Corridor</span>

              <strong>{result.route.corridor_km} KM</strong>
            </div>

            <div className="route-summary-card">
              <span>Affected Parcels</span>

              <strong>{summary.total_affected_parcels}</strong>
            </div>

            <div className="route-summary-card">
              <span>Affected Area</span>

              <strong>
                {summary.total_affected_area_acres} Acres
              </strong>
            </div>

            <div className="route-summary-card">
              <span>Disputed Parcels</span>

              <strong>{summary.disputed_parcels}</strong>
            </div>

            <div className="route-summary-card">
              <span>Pending Compensation</span>

              <strong>{summary.pending_compensation}</strong>
            </div>
          </div>

          {/* ROUTE MAP */}
          <div className="route-table-card route-map-card">
            <div className="route-table-header">
              <div>
                <h2>Route Survey Map</h2>
                <p>
                  Selected route corridor aur affected land area ka
                  geographical overview.
                </p>
              </div>
            </div>

            <MapView parcels={result.parcels} start={result.route.start} end={result.route.end} routeGeometry={result.route.geometry} corridorKm={result.route.corridor_km} />
          </div>
          {/* ROUTE INSIGHT */}
          <div className="route-table-card">
            <div className="route-table-header">
              <div>
                <h2>Route Analysis Summary</h2>

                <p>
                  Selected corridor ke andar land acquisition
                  impact ka overview.
                </p>
              </div>

              <div>
                <strong>
                  Average Distance:{" "}
                  {summary.average_distance_from_route_km} KM
                </strong>
              </div>
            </div>

            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Land ID</th>
                    <th>Owner</th>
                    <th>Khasra</th>
                    <th>Village</th>
                    <th>Tehsil</th>
                    <th>District</th>
                    <th>Area</th>
                    <th>Distance</th>
                    <th>Status</th>
                    <th>Legal Case</th>
                    <th>Compensation</th>
                  </tr>
                </thead>

                <tbody>
                  {result.parcels?.length > 0 ? (
                    result.parcels.map((land) => (
                      <tr key={land.land_id}>
                        <td>
                          <strong>{land.land_id}</strong>
                        </td>

                        <td>
                          {land.owner_name || "Not Available"}
                        </td>

                        <td>
                          {land.khasra_number || "Not Available"}
                        </td>

                        <td>
                          {land.village || "Not Available"}
                        </td>

                        <td>
                          {land.tehsil || "Not Available"}
                        </td>

                        <td>
                          {land.district || "Not Available"}
                        </td>

                        <td>
                          {land.area_acres ?? 0} Acres
                        </td>

                        <td>
                          {land.distance_from_route_km} KM
                        </td>

                        <td>
                          <span className="route-status">
                            {land.acquisition_status ||
                              "Not Available"}
                          </span>
                        </td>

                        <td>
                          <span
                            className={
                              land.legal_dispute
                                ? "legal-case"
                                : "no-legal-case"
                            }
                          >
                            {land.legal_dispute
                              ? "Case Pending"
                              : "No Case"}
                          </span>
                        </td>

                        <td>
                          {land.compensation_status ||
                            "Pending"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="11">
                        No affected land parcels found
                        within this corridor.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default RouteSurvey;





