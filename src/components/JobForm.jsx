import { useState, useEffect } from "react";
import { Form, Button, Spinner, Row, Col } from "react-bootstrap";
import { toast } from "react-toastify";
import axios from "axios";

const JobForm = ({ job, onSuccess, onCancel }) => {
  const API_URL = process.env.REACT_APP_API_URL;

  const [formData, setFormData] = useState({
    jobId: "",
    companyName: "",
    roleName: "",
    jobDescription: "",
    jobLocation: "",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState(null);

  useEffect(() => {
    if (job) {
      setFormData(job);
    } else {
      generateJobId();
    }
  }, [job]);

  const generateJobId = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/job`);
      const jobs = res.data;
      const lastJob = jobs.sort(
        (a, b) =>
          parseInt(b.jobId.replace("JOB", "")) -
          parseInt(a.jobId.replace("JOB", ""))
      )[0];
      const newIdNumber = lastJob
        ? parseInt(lastJob.jobId.replace("JOB", "")) + 1
        : 1001;
      setFormData((prev) => ({ ...prev, jobId: `JOB${newIdNumber}` }));
    } catch (err) {
      console.error("Error generating Job ID", err);
    }
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "jobId" && !job) {
      if (!value) {
        setErrors((prev) => ({ ...prev, jobId: "Job ID is required" }));
      } else {
        try {
          const res = await axios.get(`${API_URL}/api/job`);
          const exists = res.data.find((j) => j.jobId === value);
          if (exists) {
            setErrors((prev) => ({
              ...prev,
              jobId: "This job code already exists",
            }));
          } else {
            setErrors((prev) => {
              const { jobId, ...rest } = prev;
              return rest;
            });
          }
        } catch (err) {
          console.error("Error checking jobId", err);
        }
      }
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    validateAll(name, value);
  };

  const validateAll = async () => {
    const newErrors = {};

    if (!formData.jobId) {
      newErrors.jobId = "Job ID is required";
    } else if (!job) {
      try {
        const res = await axios.get(`${API_URL}/api/job`);
        const exists = res.data.find((j) => j.jobId === formData.jobId);
        if (exists) newErrors.jobId = "This job code already exists";
      } catch (err) {
        console.error("Error checking jobId", err);
      }
    }

    if (!formData.companyName || formData.companyName.trim().length < 10) {
      newErrors.companyName = "Company name must be at least 10 characters";
    }

    if (!formData.roleName) {
      newErrors.roleName = "Role name is required";
    }

    if (
      !/^([a-zA-Z\s]+),\s?([a-zA-Z\s]+)\s?-\s?([a-zA-Z\s]+)$/.test(
        formData.jobLocation
      )
    ) {
      newErrors.jobLocation = "Please enter location as: City, State - Country";
    }

    if (
      !formData.jobDescription ||
      formData.jobDescription.trim().split(/\s+/).length < 30
    ) {
      newErrors.jobDescription = "Minimum 30 words required in description";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = await validateAll();
    if (!isValid) return;

    setSubmitting(true);
    setServerError(null);

    try {
      if (job && job._id) {
        await axios.put(`${API_URL}/api/job/${job._id}`, formData);
        toast.success("Job updated successfully!");
      } else {
        await axios.post(`${API_URL}/api/job/`, formData);
        toast.success("Job added successfully!");
        generateJobId();
        setFormData((prev) => ({
          ...prev,
          companyName: "",
          roleName: "",
          jobDescription: "",
          jobLocation: "",
        }));
      }
      onSuccess();
    } catch (error) {
      setServerError("An error occurred while submitting the form.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Job ID</Form.Label>
            <Form.Control
              type="text"
              name="jobId"
              value={formData.jobId}
              onChange={handleChange}
              disabled={!!job}
              isInvalid={!!errors.jobId}
              placeholder="Enter Job ID"
            />
            <Form.Control.Feedback type="invalid">
              {errors.jobId}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Company Name</Form.Label>
            <Form.Control
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              onBlur={handleBlur}
              isInvalid={!!errors.companyName}
            />
            <Form.Control.Feedback type="invalid">
              {errors.companyName}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Role Name</Form.Label>
            <Form.Control
              type="text"
              name="roleName"
              value={formData.roleName}
              onChange={handleChange}
              onBlur={handleBlur}
              isInvalid={!!errors.roleName}
            />
            <Form.Control.Feedback type="invalid">
              {errors.roleName}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Job Location</Form.Label>
            <Form.Control
              type="text"
              name="jobLocation"
              value={formData.jobLocation}
              onChange={handleChange}
              onBlur={handleBlur}
              isInvalid={!!errors.jobLocation}
              placeholder="e.g., Chennai, TN - India"
            />
            <Form.Control.Feedback type="invalid">
              {errors.jobLocation}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      <Form.Group className="mb-3">
        <Form.Label>Job Description</Form.Label>
        <Form.Control
          as="textarea"
          rows={4}
          name="jobDescription"
          value={formData.jobDescription}
          onChange={handleChange}
          onBlur={handleBlur}
          isInvalid={!!errors.jobDescription}
        />
        <Form.Control.Feedback type="invalid">
          {errors.jobDescription}
        </Form.Control.Feedback>
      </Form.Group>

      <div className="d-flex justify-content-between">
        <Button variant="primary" type="submit" disabled={submitting}>
          {submitting ? (
            <Spinner size="sm" animation="border" />
          ) : job ? (
            "Update Job"
          ) : (
            "Add Job"
          )}
        </Button>
        {job && (
          <Button variant="secondary" onClick={onCancel} disabled={submitting}>
            Cancel
          </Button>
        )}
      </div>
    </Form>
  );
};

export default JobForm;
