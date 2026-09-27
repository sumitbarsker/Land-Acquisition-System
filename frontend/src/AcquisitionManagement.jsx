import { useEffect, useState } from "react";
import axios from "axios";

import {
  Bell,
  Award,
  IndianRupee,
  RefreshCw,
  CheckCircle,
  Clock,
  FileText,
  Plus,
  X,
  WalletCards,
} from "lucide-react";


function AcquisitionManagement() {

  const [notifications, setNotifications] = useState([]);
  const [awards, setAwards] = useState([]);
  const [compensation, setCompensation] = useState([]);

  const [loading, setLoading] = useState(true);
  const [activeForm, setActiveForm] = useState(null);


  const [notificationForm, setNotificationForm] = useState({
    project_id: "",
    notification_number: "",
    notification_type: "Section 11 Preliminary Notification",
    affected_land: "",
  });


  const [awardForm, setAwardForm] = useState({
    project_id: "",
    award_number: "",
    affected_land: "",
    compensation_amount: "",
  });


  const [compensationForm, setCompensationForm] = useState({
    project_id: "",
    land_id: "",
    owner_name: "",
    assessed_amount: "",
  });


  const [paymentForm, setPaymentForm] = useState({
    land_id: "",
    disbursed_amount: "",
  });


  // ==========================================
  // LOAD DATA
  // ==========================================

  const loadData = async () => {

    try {

      setLoading(true);

      const [
        notificationResponse,
        awardResponse,
        compensationResponse,
      ] = await Promise.all([

        axios.get(
          "http://127.0.0.1:8000/notifications/"
        ),

        axios.get(
          "http://127.0.0.1:8000/awards/"
        ),

        axios.get(
          "http://127.0.0.1:8000/compensation/"
        ),

      ]);


      setNotifications(
        notificationResponse.data.notifications || []
      );


      setAwards(
        awardResponse.data.awards || []
      );


      setCompensation(
        compensationResponse.data.compensation || []
      );

    } catch (error) {

      console.error(
        "Failed to load acquisition data:",
        error
      );

    } finally {

      setLoading(false);

    }

  };


  useEffect(() => {

    loadData();

  }, []);


  // ==========================================
  // CALCULATIONS
  // ==========================================

  const totalAssessed = compensation.reduce(
    (total, record) =>
      total + Number(record.assessed_amount || 0),
    0
  );


  const totalDisbursed = compensation.reduce(
    (total, record) =>
      total + Number(record.disbursed_amount || 0),
    0
  );


  const pendingPayments = compensation.filter(
    (record) =>
      record.payment_status !== "Paid"
  ).length;


  const formatAmount = (amount) => {

    return new Intl.NumberFormat(
      "en-IN",
      {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }
    ).format(amount);

  };


  // ==========================================
  // ISSUE NOTIFICATION
  // ==========================================

  const submitNotification = async (event) => {

    event.preventDefault();

    try {

      await axios.post(
        "http://127.0.0.1:8000/notifications/",
        {
          project_id:
            notificationForm.project_id,

          notification_number:
            notificationForm.notification_number,

          notification_type:
            notificationForm.notification_type,

          affected_land:
            Number(notificationForm.affected_land),
        }
      );


      alert(
        "Acquisition notification issued successfully."
      );


      setNotificationForm({
        project_id: "",
        notification_number: "",
        notification_type:
          "Section 11 Preliminary Notification",
        affected_land: "",
      });


      setActiveForm(null);

      loadData();

    } catch (error) {

      alert(
        error.response?.data?.detail ||
        "Failed to issue notification."
      );

    }

  };


  // ==========================================
  // DECLARE AWARD
  // ==========================================

  const submitAward = async (event) => {

    event.preventDefault();

    try {

      await axios.post(
        "http://127.0.0.1:8000/awards/",
        {
          project_id:
            awardForm.project_id,

          award_number:
            awardForm.award_number,

          affected_land:
            Number(awardForm.affected_land),

          compensation_amount:
            Number(awardForm.compensation_amount),
        }
      );


      alert(
        "Land acquisition award declared successfully."
      );


      setAwardForm({
        project_id: "",
        award_number: "",
        affected_land: "",
        compensation_amount: "",
      });


      setActiveForm(null);

      loadData();

    } catch (error) {

      alert(
        error.response?.data?.detail ||
        "Failed to declare award."
      );

    }

  };


  // ==========================================
  // CREATE COMPENSATION
  // ==========================================

  const submitCompensation = async (event) => {

    event.preventDefault();

    try {

      await axios.post(
        "http://127.0.0.1:8000/compensation/",
        {
          project_id:
            compensationForm.project_id,

          land_id:
            compensationForm.land_id,

          owner_name:
            compensationForm.owner_name,

          assessed_amount:
            Number(compensationForm.assessed_amount),
        }
      );


      alert(
        "Compensation record created successfully."
      );


      setCompensationForm({
        project_id: "",
        land_id: "",
        owner_name: "",
        assessed_amount: "",
      });


      setActiveForm(null);

      loadData();

    } catch (error) {

      alert(
        error.response?.data?.detail ||
        "Failed to create compensation record."
      );

    }

  };


  // ==========================================
  // DISBURSE PAYMENT
  // ==========================================

  const submitPayment = async (event) => {

    event.preventDefault();

    try {

      await axios.put(
        `http://127.0.0.1:8000/compensation/${paymentForm.land_id}/payment`,
        {
          disbursed_amount:
            Number(paymentForm.disbursed_amount),
        }
      );


      alert(
        "Compensation payment updated successfully."
      );


      setPaymentForm({
        land_id: "",
        disbursed_amount: "",
      });


      setActiveForm(null);

      loadData();

    } catch (error) {

      alert(
        error.response?.data?.detail ||
        "Failed to update payment."
      );

    }

  };


  // ==========================================
  // OPEN PAYMENT FORM
  // ==========================================

  const openPaymentForm = (record) => {

    setPaymentForm({
      land_id: record.land_id,
      disbursed_amount:
        record.disbursed_amount || "",
    });

    setActiveForm("payment");

  };


  return (

    <div className="acquisition-page">


      {/* =====================================
          HEADER
      ====================================== */}

      <div className="acquisition-header">

        <div>

          <h1>
            Acquisition Management
          </h1>

          <p>
            Track notifications, awards and compensation
            across the land acquisition lifecycle
          </p>

        </div>


        <div className="acquisition-header-actions">


          <button
            className="acquisition-action-button notification-action"
            onClick={() =>
              setActiveForm("notification")
            }
          >

            <Plus size={15} />

            Issue Notification

          </button>


          <button
            className="acquisition-action-button award-action"
            onClick={() =>
              setActiveForm("award")
            }
          >

            <Plus size={15} />

            Declare Award

          </button>


          <button
            className="acquisition-action-button compensation-action"
            onClick={() =>
              setActiveForm("compensation")
            }
          >

            <Plus size={15} />

            Add Compensation

          </button>


          <button
            className="acquisition-action-button payment-action"
            onClick={() =>
              setActiveForm("payment")
            }
          >

            <WalletCards size={15} />

            Disburse Payment

          </button>


          <button
            className="acquisition-refresh"
            onClick={loadData}
            disabled={loading}
          >

            <RefreshCw
              size={16}
              className={
                loading ? "spin" : ""
              }
            />

            Refresh

          </button>

        </div>

      </div>


      {/* =====================================
          MODAL
      ====================================== */}

      {activeForm && (

        <div
          className="acquisition-modal-overlay"
          onClick={(event) => {

            if (
              event.target === event.currentTarget
            ) {

              setActiveForm(null);

            }

          }}
        >

          <div className="acquisition-modal">


            <div className="acquisition-modal-header">

              <div>

                <h2>

                  {activeForm === "notification" &&
                    "Issue Acquisition Notification"}

                  {activeForm === "award" &&
                    "Declare Land Acquisition Award"}

                  {activeForm === "compensation" &&
                    "Create Compensation Record"}

                  {activeForm === "payment" &&
                    "Disburse Compensation Payment"}

                </h2>


                <p>
                  Enter the required acquisition details
                </p>

              </div>


              <button
                className="modal-close-button"
                onClick={() =>
                  setActiveForm(null)
                }
              >

                <X size={18} />

              </button>

            </div>


            {/* =================================
                NOTIFICATION FORM
            ================================== */}

            {activeForm === "notification" && (

              <form
                className="acquisition-form"
                onSubmit={submitNotification}
              >

                <label>

                  Project ID

                  <input
                    type="text"
                    placeholder="PRJ-MP-001"
                    value={
                      notificationForm.project_id
                    }
                    onChange={(event) =>
                      setNotificationForm({
                        ...notificationForm,
                        project_id:
                          event.target.value,
                      })
                    }
                    required
                  />

                </label>


                <label>

                  Notification Number

                  <input
                    type="text"
                    placeholder="NOT-MP-2026-002"
                    value={
                      notificationForm.notification_number
                    }
                    onChange={(event) =>
                      setNotificationForm({
                        ...notificationForm,
                        notification_number:
                          event.target.value,
                      })
                    }
                    required
                  />

                </label>


                <label>

                  Notification Type

                  <select
                    value={
                      notificationForm.notification_type
                    }
                    onChange={(event) =>
                      setNotificationForm({
                        ...notificationForm,
                        notification_type:
                          event.target.value,
                      })
                    }
                  >

                    <option>
                      Section 11 Preliminary Notification
                    </option>

                    <option>
                      Section 19 Declaration
                    </option>

                    <option>
                      Urgent Acquisition Notification
                    </option>

                  </select>

                </label>


                <label>

                  Affected Land (Acres)

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="125.50"
                    value={
                      notificationForm.affected_land
                    }
                    onChange={(event) =>
                      setNotificationForm({
                        ...notificationForm,
                        affected_land:
                          event.target.value,
                      })
                    }
                    required
                  />

                </label>


                <button
                  className="acquisition-submit-button"
                  type="submit"
                >

                  <CheckCircle size={16} />

                  Issue Notification

                </button>

              </form>

            )}


            {/* =================================
                AWARD FORM
            ================================== */}

            {activeForm === "award" && (

              <form
                className="acquisition-form"
                onSubmit={submitAward}
              >

                <label>

                  Project ID

                  <input
                    type="text"
                    placeholder="PRJ-MP-001"
                    value={
                      awardForm.project_id
                    }
                    onChange={(event) =>
                      setAwardForm({
                        ...awardForm,
                        project_id:
                          event.target.value,
                      })
                    }
                    required
                  />

                </label>


                <label>

                  Award Number

                  <input
                    type="text"
                    placeholder="AWD-MP-2026-002"
                    value={
                      awardForm.award_number
                    }
                    onChange={(event) =>
                      setAwardForm({
                        ...awardForm,
                        award_number:
                          event.target.value,
                      })
                    }
                    required
                  />

                </label>


                <label>

                  Affected Land (Acres)

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="125.50"
                    value={
                      awardForm.affected_land
                    }
                    onChange={(event) =>
                      setAwardForm({
                        ...awardForm,
                        affected_land:
                          event.target.value,
                      })
                    }
                    required
                  />

                </label>


                <label>

                  Compensation Amount (₹)

                  <input
                    type="number"
                    min="0"
                    placeholder="45000000"
                    value={
                      awardForm.compensation_amount
                    }
                    onChange={(event) =>
                      setAwardForm({
                        ...awardForm,
                        compensation_amount:
                          event.target.value,
                      })
                    }
                    required
                  />

                </label>


                <button
                  className="acquisition-submit-button"
                  type="submit"
                >

                  <Award size={16} />

                  Declare Award

                </button>

              </form>

            )}


            {/* =================================
                COMPENSATION FORM
            ================================== */}

            {activeForm === "compensation" && (

              <form
                className="acquisition-form"
                onSubmit={submitCompensation}
              >

                <label>

                  Project ID

                  <input
                    type="text"
                    placeholder="PRJ-MP-001"
                    value={
                      compensationForm.project_id
                    }
                    onChange={(event) =>
                      setCompensationForm({
                        ...compensationForm,
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
                    placeholder="MP-BPL-002"
                    value={
                      compensationForm.land_id
                    }
                    onChange={(event) =>
                      setCompensationForm({
                        ...compensationForm,
                        land_id:
                          event.target.value,
                      })
                    }
                    required
                  />

                </label>


                <label>

                  Owner Name

                  <input
                    type="text"
                    placeholder="Rajesh Sharma"
                    value={
                      compensationForm.owner_name
                    }
                    onChange={(event) =>
                      setCompensationForm({
                        ...compensationForm,
                        owner_name:
                          event.target.value,
                      })
                    }
                    required
                  />

                </label>


                <label>

                  Assessed Amount (₹)

                  <input
                    type="number"
                    min="0"
                    placeholder="1250000"
                    value={
                      compensationForm.assessed_amount
                    }
                    onChange={(event) =>
                      setCompensationForm({
                        ...compensationForm,
                        assessed_amount:
                          event.target.value,
                      })
                    }
                    required
                  />

                </label>


                <button
                  className="acquisition-submit-button"
                  type="submit"
                >

                  <IndianRupee size={16} />

                  Create Compensation

                </button>

              </form>

            )}


            {/* =================================
                PAYMENT FORM
            ================================== */}

            {activeForm === "payment" && (

              <form
                className="acquisition-form"
                onSubmit={submitPayment}
              >

                <label>

                  Land ID

                  <input
                    type="text"
                    placeholder="MP-BPL-001"
                    value={
                      paymentForm.land_id
                    }
                    onChange={(event) =>
                      setPaymentForm({
                        ...paymentForm,
                        land_id:
                          event.target.value,
                      })
                    }
                    required
                  />

                </label>


                <label>

                  Disbursed Amount (₹)

                  <input
                    type="number"
                    min="0"
                    placeholder="1250000"
                    value={
                      paymentForm.disbursed_amount
                    }
                    onChange={(event) =>
                      setPaymentForm({
                        ...paymentForm,
                        disbursed_amount:
                          event.target.value,
                      })
                    }
                    required
                  />

                </label>


                <button
                  className="acquisition-submit-button"
                  type="submit"
                >

                  <WalletCards size={16} />

                  Update Payment

                </button>

              </form>

            )}

          </div>

        </div>

      )}


      {/* =====================================
          SUMMARY
      ====================================== */}

      <div className="acquisition-summary">


        <div className="acquisition-summary-card">

          <div className="acquisition-summary-icon notification-icon">

            <Bell size={20} />

          </div>

          <div>

            <span>
              Notifications
            </span>

            <strong>
              {notifications.length}
            </strong>

          </div>

        </div>


        <div className="acquisition-summary-card">

          <div className="acquisition-summary-icon award-icon">

            <Award size={20} />

          </div>

          <div>

            <span>
              Awards Declared
            </span>

            <strong>
              {awards.length}
            </strong>

          </div>

        </div>


        <div className="acquisition-summary-card">

          <div className="acquisition-summary-icon compensation-icon">

            <IndianRupee size={20} />

          </div>

          <div>

            <span>
              Total Assessed
            </span>

            <strong>
              {formatAmount(totalAssessed)}
            </strong>

          </div>

        </div>


        <div className="acquisition-summary-card">

          <div className="acquisition-summary-icon paid-icon">

            <CheckCircle size={20} />

          </div>

          <div>

            <span>
              Total Disbursed
            </span>

            <strong>
              {formatAmount(totalDisbursed)}
            </strong>

          </div>

        </div>

      </div>


      {/* =====================================
          NOTIFICATIONS
      ====================================== */}

      <div className="acquisition-section">

        <div className="acquisition-section-header">

          <div>

            <h2>

              <Bell size={19} />

              Acquisition Notifications

            </h2>

            <p>
              Statutory notifications issued for acquisition proposals
            </p>

          </div>


          <span className="section-count">
            {notifications.length} Records
          </span>

        </div>


        {notifications.length === 0 ? (

          <div className="acquisition-empty">

            <FileText size={28} />

            <span>
              No acquisition notifications found.
            </span>

          </div>

        ) : (

          <div className="acquisition-table-wrapper">

            <table className="acquisition-table">

              <thead>

                <tr>

                  <th>Notification</th>
                  <th>Project</th>
                  <th>Type</th>
                  <th>Date</th>
                  <th>Land</th>
                  <th>Status</th>

                </tr>

              </thead>


              <tbody>

                {notifications.map(
                  (notification) => (

                    <tr key={notification.id}>

                      <td>

                        <strong>
                          {notification.notification_number}
                        </strong>

                      </td>

                      <td>
                        {notification.project_id}
                      </td>

                      <td>
                        {notification.notification_type}
                      </td>

                      <td>
                        {notification.notification_date}
                      </td>

                      <td>
                        {notification.affected_land} Acres
                      </td>

                      <td>

                        <span className="acquisition-status issued">

                          <CheckCircle size={13} />

                          {notification.status}

                        </span>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>


      {/* =====================================
          AWARDS
      ====================================== */}

      <div className="acquisition-section">

        <div className="acquisition-section-header">

          <div>

            <h2>

              <Award size={19} />

              Land Acquisition Awards

            </h2>

            <p>
              Awards declared for acquired land parcels
            </p>

          </div>


          <span className="section-count">
            {awards.length} Records
          </span>

        </div>


        {awards.length === 0 ? (

          <div className="acquisition-empty">

            <Award size={28} />

            <span>
              No land awards found.
            </span>

          </div>

        ) : (

          <div className="acquisition-table-wrapper">

            <table className="acquisition-table">

              <thead>

                <tr>

                  <th>Award Number</th>
                  <th>Project</th>
                  <th>Award Date</th>
                  <th>Land</th>
                  <th>Compensation</th>
                  <th>Status</th>

                </tr>

              </thead>


              <tbody>

                {awards.map(
                  (award) => (

                    <tr key={award.id}>

                      <td>

                        <strong>
                          {award.award_number}
                        </strong>

                      </td>

                      <td>
                        {award.project_id}
                      </td>

                      <td>
                        {award.award_date}
                      </td>

                      <td>
                        {award.affected_land} Acres
                      </td>

                      <td>

                        <strong>
                          {formatAmount(
                            award.compensation_amount
                          )}
                        </strong>

                      </td>

                      <td>

                        <span className="acquisition-status declared">

                          <CheckCircle size={13} />

                          {award.status}

                        </span>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>


      {/* =====================================
          COMPENSATION
      ====================================== */}

      <div className="acquisition-section">

        <div className="acquisition-section-header">

          <div>

            <h2>

              <IndianRupee size={19} />

              Compensation Tracking

            </h2>

            <p>
              Compensation assessment and disbursement monitoring
            </p>

          </div>


          <div className="compensation-header-stats">

            <span>

              <Clock size={13} />

              {pendingPayments} Pending

            </span>


            <span>
              {compensation.length} Records
            </span>

          </div>

        </div>


        {compensation.length === 0 ? (

          <div className="acquisition-empty">

            <IndianRupee size={28} />

            <span>
              No compensation records found.
            </span>

          </div>

        ) : (

          <div className="acquisition-table-wrapper">

            <table className="acquisition-table">

              <thead>

                <tr>

                  <th>Land ID</th>
                  <th>Owner</th>
                  <th>Project</th>
                  <th>Assessed</th>
                  <th>Disbursed</th>
                  <th>Payment Status</th>
                  <th>Action</th>

                </tr>

              </thead>


              <tbody>

                {compensation.map(
                  (record) => (

                    <tr key={record.id}>

                      <td>

                        <strong>
                          {record.land_id}
                        </strong>

                      </td>

                      <td>
                        {record.owner_name}
                      </td>

                      <td>
                        {record.project_id}
                      </td>

                      <td>
                        {formatAmount(
                          record.assessed_amount
                        )}
                      </td>

                      <td>
                        {formatAmount(
                          record.disbursed_amount
                        )}
                      </td>

                      <td>

                        <span
                          className={`acquisition-status ${
                            record.payment_status
                              .toLowerCase()
                              .replace(" ", "-")
                          }`}
                        >

                          {record.payment_status === "Paid" ? (

                            <CheckCircle size={13} />

                          ) : (

                            <Clock size={13} />

                          )}

                          {record.payment_status}

                        </span>

                      </td>


                      <td>

                        {record.payment_status !== "Paid" && (

                          <button
                            className="payment-table-button"
                            onClick={() =>
                              openPaymentForm(record)
                            }
                          >

                            <WalletCards size={13} />

                            Pay

                          </button>

                        )}

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>


      {/* =====================================
          DISBURSEMENT SUMMARY
      ====================================== */}

      <div className="disbursement-summary">

        <div>

          <span>
            Compensation Assessed
          </span>

          <strong>
            {formatAmount(totalAssessed)}
          </strong>

        </div>


        <div>

          <span>
            Compensation Disbursed
          </span>

          <strong>
            {formatAmount(totalDisbursed)}
          </strong>

        </div>


        <div>

          <span>
            Remaining Amount
          </span>

          <strong>
            {formatAmount(
              Math.max(
                totalAssessed - totalDisbursed,
                0
              )
            )}
          </strong>

        </div>

      </div>

    </div>

  );

}


export default AcquisitionManagement;