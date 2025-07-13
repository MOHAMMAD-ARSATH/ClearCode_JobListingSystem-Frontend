import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Spinner } from "react-bootstrap";
import axios from "axios";

import UserNav from "./UserNav";

const JobHeader = () => {
  const API_URL = process.env.REACT_APP_API_URL;

  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    axios
      .get(`${API_URL}/api/job/${id}`)
      .then((response) => setJob(response.data))
      .catch((error) => console.error("Error fetching job:", error))
      .finally(() => setLoading(false));
  }, [id, API_URL]);

  if (loading) {
    return (
      <div className="job-header text-center my-5">
        <Spinner animation="border" variant="primary" />
        <div className="mt-3">Loading... Please wait</div>
      </div>
    );
  }

  if (!job) {
    return <div className="job-header text-center my-5">Job not found.</div>;
  }

  return (
    <div className="job-header">
      <UserNav />
      <div className="job-overlay">
        {loading ? (
          <div className="text-center my-5">
            <Spinner animation="border" role="status" variant="primary" />
            <div className="mt-3">Loading... Please wait</div>
          </div>
        ) : (
          <>
            <h3>{job.companyName} | Full Time</h3>
            <h1 className="fw-bold">{job.roleName}</h1>
            <h4>{job.jobLocation}</h4>
            <Button
              variant="outline-primary"
              className="interested-btn mt-5 px-4 py-2"
              onClick={() => navigate(`/applyjob/${job._id}`)}
            >
              I'm Interested
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default JobHeader;
