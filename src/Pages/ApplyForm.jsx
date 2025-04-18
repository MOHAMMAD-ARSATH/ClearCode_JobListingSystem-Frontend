import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Form, Button, Row, Col } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";

import JobHeader from "../components/JobHeader";
import Breadcrumbs from "../components/Breadcrumbs";

const ApplyForm = () => {
  const API_URL = process.env.REACT_APP_API_URL;
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    address: "",
    gender: "",
  });

  const resumeRef = useRef(null);
  const coverLetterRef = useRef(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPhone = (phone) => /^[0-9]{10,15}$/.test(phone);

  const validateForm = () => {
    const { name, email, contact, address } = formData;
    const resume = resumeRef.current?.files[0];

    if (!name.trim()) return toast.error("Name is required");
    if (!email.trim() || !isValidEmail(email)) return toast.error("Please enter a valid email");
    if (!contact.trim() || !isValidPhone(contact)) return toast.error("Enter a valid phone number (10–15 digits)");
    if (!address.trim()) return toast.error("Address is required");
    if (!resume) return toast.error("Please upload your resume");
    if (resume.size > 5 * 1024 * 1024) return toast.error("Resume should not exceed 5MB");

    return true;
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validateForm()) return;

  setSubmitting(true);

  const resume = resumeRef.current.files[0];
  const coverLetter = coverLetterRef.current.files[0];

  const data = new FormData();
  data.append("name", formData.name);
  data.append("email", formData.email);
  data.append("contact", formData.contact);
  data.append("address", formData.address);
  data.append("gender", formData.gender);
  data.append("resume", resume);
  if (coverLetter) data.append("coverLetter", coverLetter);
  data.append("job", job._id);

  // Log the FormData to ensure it's correct
  for (let pair of data.entries()) {
    console.log(pair[0], pair[1]);
  }

  try {
    const response = await axios.post(`${API_URL}/api/apply`, data);
    toast.success(
      response.data.message || "Application submitted successfully!"
    );

    setFormData({
      name: "",
      email: "",
      contact: "",
      address: "",
      gender: "",
    });
    resumeRef.current.value = "";
    coverLetterRef.current.value = "";

    setTimeout(() => {
      navigate("/");
    }, 6000);
  } catch (error) {
    toast.error(
      error.response?.data?.message || "An error occurred while submitting."
    );
  } finally {
    setSubmitting(false);
  }
};

  useEffect(() => {
    window.scrollTo(0, 0);

    if (!id) {
      toast.error("Invalid job ID");
      return;
    }

    axios
      .get(`${API_URL}/api/job/${id}`)
      .then((res) => setJob(res.data))
      .catch((err) => {
        console.error("Job fetch failed:", err);
        toast.error("Failed to load job details.");
      });
  }, [API_URL, id]);

  const breadcrumbsPaths = [
    { label: "Home", link: "/" },
    ...(job._id ? [{ label: "Job Description", link: `/viewjob/${job._id}` }] : []),
    { label: "Apply Form" },
  ];

  return (
    <>
      <JobHeader />
      <Breadcrumbs paths={breadcrumbsPaths} />
      <Container className="py-4 form-container">
        <ToastContainer position="top-center" />
        <h3 className="text-center mb-4">Application Form</h3>
        {job.title && (
          <h5 className="text-center text-muted mb-3">
            Applying for: <strong>{job.title}</strong>
          </h5>
        )}

        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="name">Name <span className="required">*</span></Form.Label>
                <Form.Control
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  placeholder="Enter your name"
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="email">Email <span className="required">*</span></Form.Label>
                <Form.Control
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  placeholder="Enter your email"
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="contact">Contact Number <span className="required">*</span></Form.Label>
                <Form.Control
                  type="text"
                  id="contact"
                  name="contact"
                  value={formData.contact}
                  placeholder="Enter your phone number"
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="gender">Gender</Form.Label>
                <Form.Select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="address">Address <span className="required">*</span></Form.Label>
                <Form.Control
                  as="textarea"
                  id="address"
                  rows={5}
                  name="address"
                  value={formData.address}
                  placeholder="Enter your address"
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-4">
                <Form.Label htmlFor="resume">Resume (PDF/DOC) <span className="required">*</span></Form.Label>
                <Form.Control
                  type="file"
                  id="resume"
                  name="resume"
                  ref={resumeRef}
                  accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label htmlFor="coverLetter">Cover Letter (optional)</Form.Label>
                <Form.Control
                  type="file"
                  id="coverLetter"
                  name="coverLetter"
                  ref={coverLetterRef}
                  accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                />
              </Form.Group>
            </Col>
          </Row>

          <div className="text-center mt-4">
            <Button
              variant="primary"
              type="submit"
              className="submit-btn px-4 py-2"
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Submit Application"}
            </Button>
          </div>
        </Form>
      </Container>
    </>
  );
};

export default ApplyForm;
