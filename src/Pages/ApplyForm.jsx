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
  const [job, setJob] = useState({});

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    address: "",
    gender: "",
  });

  const resumeRef = useRef(null);
  const coverLetterRef = useRef(null);

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPhone = (phone) => /^[0-9]{10,15}$/.test(phone);

  const validateForm = () => {
    const { name, email, contact, address } = formData;
    const resume = resumeRef.current?.files[0];

    if (!name.trim()) {
      toast.error("Name is required");
      return false;
    }
    if (!email.trim() || !isValidEmail(email)) {
      toast.error("Please enter a valid email");
      return false;
    }
    if (!contact.trim() || !isValidPhone(contact)) {
      toast.error("Please enter a valid contact number (10-15 digits)");
      return false;
    }
    if (!address.trim()) {
      toast.error("Address is required");
      return false;
    }
    if (!resume) {
      toast.error("Please upload your resume");
      return false;
    }
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

    try {
    const response = await axios.post(`${API_URL}/api/apply`, data) 
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
    axios
      .get(`${API_URL}/api/job/${id}`)
      .then((response) => {
        setJob(response.data);
      })
      .catch((error) => {
        console.error("Error fetching jobs:", error);
      });
  }, [API_URL, id]);

  const breadcrumbsPaths = [
    { label: "Home", link: "/" },
    { label: "Job Description", link: `/viewjob/${job._id}` },
    { label: "Apply Form" },
  ];

  return (
    <>
      <JobHeader />
      <Breadcrumbs paths={breadcrumbsPaths} />
      <Container className="py-4 form-container">
        <ToastContainer position="top-center" />
        <h3 className="text-center mb-4">Application Form</h3>

        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  Name <span className="required">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  placeholder="Enter your name"
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  Email <span className="required">*</span>
                </Form.Label>
                <Form.Control
                  type="email"
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
                <Form.Label>
                  Contact Number <span className="required">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="contact"
                  value={formData.contact}
                  placeholder="Enter your phone number"
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Gender</Form.Label>
                <Form.Select
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
                <Form.Label>
                  Address <span className="required">*</span>
                </Form.Label>
                <Form.Control
                  as="textarea"
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
                <Form.Label>
                  Resume (PDF/DOC) <span className="required">*</span>
                </Form.Label>
                <Form.Control
                  type="file"
                  name="resume"
                  ref={resumeRef}
                  accept=".pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Cover Letter (optional)</Form.Label>
                <Form.Control
                  type="file"
                  name="coverLetter"
                  ref={coverLetterRef}
                  accept=".pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
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
