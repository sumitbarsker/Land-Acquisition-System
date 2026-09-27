import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "./api";

import ProjectWorkflow from "./ProjectWorkflow";


function Projects() {

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedProject, setSelectedProject] = useState(null);


  const [form, setForm] = useState({
    project_id: "",
    project_name: "",
    state: "",
    district: "",
    implementing_agency: "",
    land_proposed: "",
    land_acquired: 0,
    proposal_status: "Submitted",
    current_stage: "Proposal Submission",
  });


  const loadProjects = async () => {

    try {

      const response = await axios.get(
        `${API_BASE_URL}/projects/`
      );

      setProjects(response.data.projects);

      // Update selected project after workflow change
      if (selectedProject) {

        const updatedProject =
          response.data.projects.find(
            (project) =>
              project.project_id === selectedProject.project_id
          );

        if (updatedProject) {
          setSelectedProject(updatedProject);
        }

      }

    } catch (error) {

      console.error(
        "Failed to load projects:",
        error
      );

    } finally {

      setLoading(false);

    }

  };


  useEffect(() => {

    loadProjects();

  }, []);


  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

  };


  const submitProposal = async (e) => {

    e.preventDefault();

    try {

      await axios.post(
        `${API_BASE_URL}/projects/`,
        {
          ...form,
          land_proposed: Number(form.land_proposed),
          land_acquired: Number(form.land_acquired),
        }
      );


      alert(
        "Project proposal submitted successfully"
      );


      setForm({
        project_id: "",
        project_name: "",
        state: "",
        district: "",
        implementing_agency: "",
        land_proposed: "",
        land_acquired: 0,
        proposal_status: "Submitted",
        current_stage: "Proposal Submission",
      });


      loadProjects();

    } catch (error) {

      alert(
        error.response?.data?.detail ||
        "Failed to submit project proposal"
      );

    }

  };


  return (

    <div className="projects-page">


      {/* HEADER */}

      <div className="projects-header">

        <div>

          <h1>
            Project Proposals
          </h1>

          <p>
            Submit and track land acquisition project proposals
          </p>

        </div>


        <div className="project-count">

          {projects.length} Projects

        </div>

      </div>


      {/* MAIN PROJECT AREA */}

      <div className="project-layout">


        {/* SUBMIT FORM */}

        <div className="project-form-card">

          <h2>
            Submit New Proposal
          </h2>


          <p className="form-subtitle">

            Enter project details for national land acquisition processing.

          </p>


          <form onSubmit={submitProposal}>


            <div className="project-form-grid">


              <div className="project-form-group">

                <label>
                  Project ID
                </label>

                <input
                  type="text"
                  name="project_id"
                  value={form.project_id}
                  onChange={handleChange}
                  placeholder="PRJ-MP-002"
                  required
                />

              </div>


              <div className="project-form-group">

                <label>
                  Project Name
                </label>

                <input
                  type="text"
                  name="project_name"
                  value={form.project_name}
                  onChange={handleChange}
                  placeholder="Highway Expansion Project"
                  required
                />

              </div>


              <div className="project-form-group">

                <label>
                  State
                </label>

                <input
                  type="text"
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  placeholder="Madhya Pradesh"
                  required
                />

              </div>


              <div className="project-form-group">

                <label>
                  District
                </label>

                <input
                  type="text"
                  name="district"
                  value={form.district}
                  onChange={handleChange}
                  placeholder="Bhopal"
                  required
                />

              </div>


              <div className="project-form-group">

                <label>
                  Implementing Agency
                </label>

                <input
                  type="text"
                  name="implementing_agency"
                  value={form.implementing_agency}
                  onChange={handleChange}
                  placeholder="State PWD"
                  required
                />

              </div>


              <div className="project-form-group">

                <label>
                  Land Proposed (Acres)
                </label>

                <input
                  type="number"
                  name="land_proposed"
                  value={form.land_proposed}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  required
                />

              </div>


            </div>


            <button
              type="submit"
              className="project-submit-button"
            >

              Submit Proposal

            </button>


          </form>

        </div>


        {/* PROJECT LIST */}

        <div className="project-list-card">


          <div className="project-list-header">

            <div>

              <h2>
                Submitted Projects
              </h2>

              <p>
                Current proposal status and workflow stage
              </p>

            </div>

          </div>


          {loading ? (

            <div className="project-empty">

              Loading projects...

            </div>

          ) : projects.length === 0 ? (

            <div className="project-empty">

              No project proposals found.

            </div>

          ) : (

            <div className="project-list">


              {projects.map((project) => (

                <div
                  className={`project-item ${
                    selectedProject?.project_id ===
                    project.project_id
                      ? "selected-project"
                      : ""
                  }`}
                  key={project.project_id}
                  onClick={() =>
                    setSelectedProject(project)
                  }
                  style={{
                    cursor: "pointer",
                  }}
                >


                  <div className="project-item-main">


                    <div>

                      <strong>
                        {project.project_id}
                      </strong>


                      <h3>
                        {project.project_name}
                      </h3>


                      <p>
                        {project.district},{" "}
                        {project.state}
                      </p>

                    </div>


                    <span className="project-status">

                      {project.proposal_status}

                    </span>


                  </div>


                  <div className="project-details">


                    <span>

                      Agency:

                      <strong>
                        {project.implementing_agency}
                      </strong>

                    </span>


                    <span>

                      Proposed:

                      <strong>
                        {project.land_proposed} acres
                      </strong>

                    </span>


                    <span>

                      Acquired:

                      <strong>
                        {project.land_acquired} acres
                      </strong>

                    </span>


                    <span>

                      Stage:

                      <strong>
                        {project.current_stage}
                      </strong>

                    </span>


                  </div>


                </div>

              ))}


            </div>

          )}

        </div>


      </div>


      {/* WORKFLOW */}

      {selectedProject && (

        <ProjectWorkflow
          project={selectedProject}
          onUpdate={loadProjects}
        />

      )}


    </div>

  );

}


export default Projects;