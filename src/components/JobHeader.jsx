import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from 'react-bootstrap';
import UserNav from "./UserNav";

const JobHeader = () => {
  const location = useLocation();
  const job = location.state || {};
  const navigate = useNavigate();

  return (
      <div className="job-header">
        <UserNav/>
        <div className="job-overlay">
          <h3>{job.companyName} | Full Time</h3>
          <h1 className="fw-bold">{job.roleName}</h1>
          <h4>{job.jobLocation}</h4>
          <Button 
  variant="outline-primary" 
  className="interested-btn mt-5 px-4 py-2"
  onClick={() => navigate("/applyjob", { state: job })}
>
  I'm Interested
</Button>



        </div>
      </div>
  );
};

export default JobHeader;
