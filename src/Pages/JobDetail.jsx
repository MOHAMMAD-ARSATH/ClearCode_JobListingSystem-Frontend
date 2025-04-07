import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowRightCircle } from "react-bootstrap-icons";
import { Button } from "react-bootstrap";

import JobHeader from "../components/JobHeader";

const JobDetail = () => {
  const location = useLocation();
  const job = location.state || {};
  const navigate = useNavigate();

  const formatDescription = (desc) => {
    if (!desc) return [];
    return desc
      .split(/\r?\n/)
      .filter((line) => line.trim() !== "")
      .map((line, idx) => <li key={idx}>{line.trim()}</li>);
  };

  let city = "Not Provided";
  let country = "Not Provided";

  if (job.jobLocation?.includes("-")) {
    const [parsedCity, parsedCountry] = job.jobLocation
      .split("-")
      .map((i) => i.trim());
    city = parsedCity || city;
    country = parsedCountry || country;
  }

  return (
    <div className="job-detail-wrapper">
      <JobHeader />

      <div className="job-body container">
        <div className="job-description-detail">
          <h4>Job Description</h4>
          <ul className="description-list">
            {formatDescription(job.jobDescription)}
          </ul>
          <Button
            variant="primary"
            className="m-2"
            onClick={() => navigate("/applyjob", { state: job })}
          >
            Apply Now <ArrowRightCircle className="ms-2" />
          </Button>
        </div>

        <div className="job-info">
          <h4>Job Information</h4>
          <p>
            <strong>Job ID:</strong>
            <br /> {job.jobId}
          </p>
          <p>
            <strong>Job Location:</strong>
            <br /> {city}
          </p>
          <p>
            <strong>Country:</strong> <br /> {country}
          </p>
          <p>
            <strong>Industry:</strong>
            <br /> Technology
          </p>
          <p>
            <strong>Job Posted On:</strong>
            <br /> {job.postedAt?.split("T")[0]}
          </p>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;
