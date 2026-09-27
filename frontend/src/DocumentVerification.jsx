import { useState } from "react";

import {
  FileText,
  Upload,
  CheckCircle,
  Clock,
  XCircle,
  ShieldCheck,
} from "lucide-react";


function DocumentVerification() {

  const [documents, setDocuments] = useState([
    {
      id: 1,
      name: "Land Ownership Record",
      type: "Ownership",
      status: "Verified",
    },
    {
      id: 2,
      name: "Land Survey Report",
      type: "Survey",
      status: "Pending",
    },
    {
      id: 3,
      name: "Legal Verification Report",
      type: "Legal",
      status: "Pending",
    },
    {
      id: 4,
      name: "Land Valuation Report",
      type: "Valuation",
      status: "Pending",
    },
  ]);


  const verifyDocument = (id) => {

    setDocuments(
      documents.map((document) =>
        document.id === id
          ? {
              ...document,
              status: "Verified",
            }
          : document
      )
    );

  };


  const rejectDocument = (id) => {

    setDocuments(
      documents.map((document) =>
        document.id === id
          ? {
              ...document,
              status: "Rejected",
            }
          : document
      )
    );

  };


  const handleUpload = (e) => {

    const file = e.target.files[0];

    if (!file) {
      return;
    }

    const newDocument = {
      id: Date.now(),
      name: file.name,
      type: "Uploaded Document",
      status: "Pending",
    };

    setDocuments([
      ...documents,
      newDocument,
    ]);

  };


  const verifiedCount = documents.filter(
    (document) => document.status === "Verified"
  ).length;


  const pendingCount = documents.filter(
    (document) => document.status === "Pending"
  ).length;


  const rejectedCount = documents.filter(
    (document) => document.status === "Rejected"
  ).length;


  return (

    <div className="documents-page">


      <div className="documents-header">

        <div>

          <h1>
            Digital Scrutiny
          </h1>

          <p>
            Document verification and digital scrutiny
            for land acquisition proposals
          </p>

        </div>


        <label className="document-upload-button">

          <Upload size={17} />

          Upload Document

          <input
            type="file"
            onChange={handleUpload}
            hidden
          />

        </label>

      </div>


      <div className="document-summary">


        <div className="document-summary-card">

          <ShieldCheck size={20} />

          <div>

            <span>
              Total Documents
            </span>

            <strong>
              {documents.length}
            </strong>

          </div>

        </div>


        <div className="document-summary-card">

          <CheckCircle size={20} />

          <div>

            <span>
              Verified
            </span>

            <strong>
              {verifiedCount}
            </strong>

          </div>

        </div>


        <div className="document-summary-card">

          <Clock size={20} />

          <div>

            <span>
              Pending
            </span>

            <strong>
              {pendingCount}
            </strong>

          </div>

        </div>


        <div className="document-summary-card">

          <XCircle size={20} />

          <div>

            <span>
              Rejected
            </span>

            <strong>
              {rejectedCount}
            </strong>

          </div>

        </div>


      </div>


      <div className="documents-card">


        <div className="documents-card-header">

          <div>

            <h2>
              Document Verification
            </h2>

            <p>
              Review submitted documents before approval
            </p>

          </div>

        </div>


        <div className="documents-list">


          {documents.map((document) => (

            <div
              className="document-item"
              key={document.id}
            >


              <div className="document-icon">

                <FileText size={20} />

              </div>


              <div className="document-info">

                <strong>
                  {document.name}
                </strong>

                <span>
                  {document.type}
                </span>

              </div>


              <div
                className={`document-status ${document.status.toLowerCase()}`}
              >

                {document.status}

              </div>


              <div className="document-actions">


                {document.status === "Pending" && (

                  <>

                    <button
                      className="verify-button"
                      onClick={() =>
                        verifyDocument(document.id)
                      }
                    >

                      <CheckCircle size={15} />

                      Verify

                    </button>


                    <button
                      className="reject-button"
                      onClick={() =>
                        rejectDocument(document.id)
                      }
                    >

                      <XCircle size={15} />

                      Reject

                    </button>

                  </>

                )}


                {document.status === "Verified" && (

                  <span className="verified-label">

                    <CheckCircle size={15} />

                    Verified

                  </span>

                )}


                {document.status === "Rejected" && (

                  <span className="rejected-label">

                    <XCircle size={15} />

                    Rejected

                  </span>

                )}


              </div>


            </div>

          ))}


        </div>

      </div>


    </div>

  );

}


export default DocumentVerification;