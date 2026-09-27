import { useState } from "react";
import axios from "axios";

import {
  FileText,
  Search,
  CheckCircle,
  Bell,
  Award,
  IndianRupee,
  Home,
  Users,
  ChevronRight,
} from "lucide-react";

const workflowStages = [
  {
    name: "Proposal Submission",
    icon: FileText,
  },
  {
    name: "Digital Scrutiny",
    icon: Search,
  },
  {
    name: "Approval",
    icon: CheckCircle,
  },
  {
    name: "Notification",
    icon: Bell,
  },
  {
    name: "Award",
    icon: Award,
  },
  {
    name: "Compensation",
    icon: IndianRupee,
  },
  {
    name: "Possession",
    icon: Home,
  },
  {
    name: "R&R",
    icon: Users,
  },
];

function ProjectWorkflow({ project, onUpdate }) {
  const [updating, setUpdating] = useState(false);

  if (!project) {
    return (
      <div className="workflow-empty">
        Select a project to view its workflow.
      </div>
    );
  }

  const currentIndex = workflowStages.findIndex(
    (stage) => stage.name === project.current_stage
  );

  const updateStage = async (stage) => {
    try {
      setUpdating(true);

      let status = "In Progress";

      if (stage.name === "Approval") {
        status = "Approved";
      }

      if (stage.name === "Possession") {
        status = "Possession Completed";
      }

      if (stage.name === "R&R") {
        status = "R&R In Progress";
      }

      await axios.put(
        `http://127.0.0.1:8000/projects/${project.project_id}/status`,
        {
          proposal_status: status,
          current_stage: stage.name,
        }
      );

      alert("Project workflow updated successfully");

      if (onUpdate) {
        onUpdate();
      }

    } catch (error) {
      alert(
        error.response?.data?.detail ||
        "Failed to update project workflow"
      );
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="workflow-card">

      <div className="workflow-header">

        <div>
          <h2>Project Workflow</h2>

          <p>
            End-to-end acquisition lifecycle tracking
          </p>
        </div>

        <div className="workflow-project-id">
          {project.project_id}
        </div>

      </div>


      <div className="workflow-project-info">

        <strong>
          {project.project_name}
        </strong>

        <span>
          {project.district}, {project.state}
        </span>

      </div>


      <div className="workflow-track">

        {workflowStages.map((stage, index) => {

          const Icon = stage.icon;

          const completed =
            currentIndex >= 0 &&
            index < currentIndex;

          const current =
            index === currentIndex;

          return (
            <div
              className={`workflow-stage ${
                completed ? "completed" : ""
              } ${current ? "current" : ""}`}
              key={stage.name}
            >

              <button
                className="workflow-stage-button"
                onClick={() => updateStage(stage)}
                disabled={updating}
                title={`Move project to ${stage.name}`}
              >

                <Icon size={18} />

              </button>


              <div className="workflow-stage-name">
                {stage.name}
              </div>


              {index < workflowStages.length - 1 && (
                <ChevronRight
                  className="workflow-arrow"
                  size={17}
                />
              )}

            </div>
          );

        })}

      </div>


      <div className="workflow-footer">

        <span>
          Current Stage
        </span>

        <strong>
          {project.current_stage}
        </strong>

        <span>
          Status
        </span>

        <strong>
          {project.proposal_status}
        </strong>

      </div>

    </div>
  );
}

export default ProjectWorkflow;