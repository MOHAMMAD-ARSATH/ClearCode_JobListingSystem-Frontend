import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "react-bootstrap";
import axios from "axios";

import UserNav from "./UserNav";

const JobHeader = () => {
  const navigate = useNavigate();

  const { id } = useParams();
  const API_URL = process.env.REACT_APP_API_URL;

  const [job, setJob] = useState([]);
  useEffect(() => {
    axios
      .get(`${API_URL}/api/job/${id}`)
      .then((response) => {
        setJob(response.data);
      })
      .catch((error) => {
        console.error("Error fetching jobs:", error);
      });
  }, []);

  return (
    <div className="job-header">
      <UserNav />
      <div className="job-overlay">
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
      </div>
    </div>
  );
};

export default JobHeader;