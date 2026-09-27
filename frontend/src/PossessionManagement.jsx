import { useEffect, useState } from "react";
import axios from "axios";

import {
  CheckCircle,
  Clock,
  RefreshCw,
  Plus,
  X,
  MapPin,
  FileCheck,
} from "lucide-react";

function PossessionManagement() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    project_id: "",
    land_id: "",
    possession_status: "Completed",
    remarks: "",
  });

  const loadPossession = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        "http://127.0.0.1:8000/possession/"
      );

      setRecords(response.data.possession || []);
    } catch (error) {
      console.error(
        "Failed to load possession records:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPossession();
  }, []);

  const submitPossession = async (event) => {
    event.preventDefault();

    try {
      await axios.post(
        "http://127.0.0.1:8000/possession/",
        form
      );

      alert("Possession record created successfully.");

      setForm({
        project_id: "",
        land_id: "",
        possession_status: "Completed",
        remarks: "",
      });

      setShowForm(false);

      loadPossession();
    } catch (error) {
      alert(
        error.response?.data?.detail ||
          "Failed to create possession record."
      );
    }
  };

  const completedCount = records.filter(
    (record) =>
      record.possession_status === "Completed"
  ).length;

  const pendingCount = records.filter(
    (record) =>
      record.possession_status === "Pending"
  ).length;

  return (
    <div className="possession-page">

      {/* HEADER */}
      <div className="possession-header">

        <div>
          <h1>Possession Management</h1>

          <p>
            Track physical possession of acquired land parcels
          </p>
        </div>

        <div className="possession-header-actions">

          <button
            className="possession-add-button"
            onClick={() => setShowForm(true)}
          >
            <Plus size={16} />
            Record Possession
          </button>

          <button
            className="possession-refresh-button"
            onClick={loadPossession}
            disabled={loading}
          >
            <RefreshCw
              size={16}
              className={loading ? "spin" : ""}
            />

            Refresh
          </button>

        </div>

      </div>


      {/* SUMMARY */}
      <div className="possession-summary">

        <div className="possession-summary-card">

          <div className="possession-summary-icon">
            <FileCheck size={21} />
          </div>

          <div>
            <span>Total Records</span>
            <strong>{records.length}</strong>
          </div>

        </div>


        <div className="possession-summary-card">

          <div className="possession-summary-icon completed">
            <CheckCircle size={21} />
          </div>

          <div>
            <span>Completed</span>
            <strong>{completedCount}</strong>
          </div>

        </div>


        <div className="possession-summary-card">

          <div className="possession-summary-icon pending">
            <Clock size={21} />
          </div>

          <div>
            <span>Pending</span>
            <strong>{pendingCount}</strong>
          </div>

        </div>

      </div>


      {/* MODAL */}
      {showForm && (
        <div
          className="possession-modal-overlay"
          onClick={(event) => {
            if (
              event.target === event.currentTarget
            ) {
              setShowForm(false);
            }
          }}
        >

          <div className="possession-modal">

            <div className="possession-modal-header">

              <div>
                <h2>Record Land Possession</h2>

                <p>
                  Enter the possession details
                </p>
              </div>

              <button
                className="possession-close-button"
                onClick={() => setShowForm(false)}
              >
                <X size={18} />
              </button>

            </div>


            <form
              className="possession-form"
              onSubmit={submitPossession}
            >

              <label>
                Project ID

                <input
                  type="text"
                  placeholder="PRJ-MP-001"
                  value={form.project_id}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      project_id:
                        event.target.value,
                    })
                  }
                  required
                />
              </label>


              <label>
                Land ID

                <input
                  type="text"
                  placeholder="MP-BPL-001"
                  value={form.land_id}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      land_id:
                        event.target.value,
                    })
                  }
                  required
                />
              </label>


              <label>
                Possession Status

                <select
                  value={form.possession_status}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      possession_status:
                        event.target.value,
                    })
                  }
                >
                  <option value="Completed">
                    Completed
                  </option>

                  <option value="Pending">
                    Pending
                  </option>

                  <option value="Partially Completed">
                    Partially Completed
                  </option>
                </select>
              </label>


              <label>
                Remarks

                <textarea
                  placeholder="Enter possession remarks..."
                  value={form.remarks}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      remarks:
                        event.target.value,
                    })
                  }
                />
              </label>


              <button
                type="submit"
                className="possession-submit-button"
              >
                <CheckCircle size={16} />
                Save Possession
              </button>

            </form>

          </div>

        </div>
      )}


      {/* RECORDS */}
      <div className="possession-section">

        <div className="possession-section-header">

          <div>

            <h2>
              <MapPin size={19} />
              Possession Records
            </h2>

            <p>
              Land parcels where possession has been recorded
            </p>

          </div>

          <span className="possession-count">
            {records.length} Records
          </span>

        </div>


        {loading ? (
          <div className="possession-empty">
            <RefreshCw size={30} className="spin" />
            <span>Loading possession records...</span>
          </div>
        ) : records.length === 0 ? (
          <div className="possession-empty">
            <MapPin size={30} />

            <span>
              No possession records found.
            </span>
          </div>
        ) : (
          <div className="possession-table-wrapper">

            <table className="possession-table">

              <thead>
                <tr>
                  <th>Land ID</th>
                  <th>Project</th>
                  <th>Possession Date</th>
                  <th>Status</th>
                  <th>Remarks</th>
                </tr>
              </thead>


              <tbody>

                {records.map((record) => (

                  <tr key={record.id}>

                    <td>
                      <strong>
                        {record.land_id}
                      </strong>
                    </td>


                    <td>
                      {record.project_id}
                    </td>


                    <td>
                      {record.possession_date || "—"}
                    </td>


                    <td>

                      <span
                        className={`possession-status ${
                          record.possession_status
                            ?.toLowerCase()
                            .replaceAll(" ", "-")
                        }`}
                      >

                        {record.possession_status ===
                        "Completed" ? (
                          <CheckCircle size={13} />
                        ) : (
                          <Clock size={13} />
                        )}

                        {record.possession_status}

                      </span>

                    </td>


                    <td>
                      {record.remarks || "—"}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>
        )}

      </div>

    </div>
  );
}

export default PossessionManagement;