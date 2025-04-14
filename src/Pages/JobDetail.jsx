import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowRightCircle } from "react-bootstrap-icons";
import { Button, Spinner } from "react-bootstrap";
import axios from "axios";

import JobHeader from "../components/JobHeader";
import Breadcrumbs from "../components/Breadcrumbs";

const JobDetail = () => {
  const API_URL = process.env.REACT_APP_API_URL;

  const { id } = useParams();
  const [job, setJob] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${API_URL}/api/job/${id}`)
      .then((response) => {
        setJob(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching jobs:", error);
        setLoading(false);
      });
  }, []);

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

  const breadcrumbsPaths = [
    { label: "Home", link: "/" },
    { label: "Job Description" },
  ];

  return (
    <div className="job-detail-wrapper">
      <JobHeader />
      <Breadcrumbs paths={breadcrumbsPaths} />
      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" role="status" variant="primary" />
          <div className="mt-3">Loading... Please wait</div>
        </div>
      ) : (
        <>
          <div className="job-body container">
            <div className="job-description-detail">
              <h4>Job Description</h4>

              <ul className="description-list">
                {formatDescription(job.jobDescription)}
              </ul>
              <Button
                variant="primary"
                className="m-2"
                onClick={() => navigate(`/applyjob/${job._id}`)}
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
        </>
      )}
    </div>
  );
};

export default JobDetail;
