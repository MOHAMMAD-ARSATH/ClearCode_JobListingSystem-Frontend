import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Spinner, Card, Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';

const JobForm = ({ job, onSuccess, onCancel }) => {
    const API_URL = process.env.REACT_APP_API_URL ;

    const [formData, setFormData] = useState({
        jobId: '',
        companyName: '',
        roleName: '',
        jobDescription: '',
        jobLocation: '',
    });

    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [serverError, setServerError] = useState(null);

    useEffect(() => {
        if (job) {
            setFormData(job);
        } else {
            resetForm();
        }
    }, [job]);

    const resetForm = () => {
        setFormData({
            jobId: '',
            companyName: '',
            roleName: '',
            jobDescription: '',
            jobLocation: '',
        });
        setErrors({});
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.jobId) newErrors.jobId = 'Job ID is required';
        if (!formData.companyName) newErrors.companyName = 'Company name is required';
        if (!formData.roleName) newErrors.roleName = 'Role name is required';
        if (!formData.jobDescription) newErrors.jobDescription = 'Job description is required';
        if (!formData.jobLocation) newErrors.jobLocation = 'Job location is required';
        return newErrors;
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        setSubmitting(true);
        setServerError(null);

        try {
            if (job && job._id) {
                await axios.put(`${API_URL}/api/job/${job._id}`, formData);
                toast.success('Job updated successfully!');
            } else {
                await axios.post(`${API_URL}/api/job/`, formData);
                toast.success('Job added successfully!');
                resetForm(); 
            }
            onSuccess(); 
        } catch (error) {
            setServerError('An error occurred while submitting the form.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div>
            <Card.Body>
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
                                    isInvalid={!!errors.jobId}
                                    disabled={!!job}
                                    placeholder="Enter Job ID"
                                />
                                <Form.Control.Feedback type="invalid">{errors.jobId}</Form.Control.Feedback>
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
                                    isInvalid={!!errors.companyName}
                                     placeholder="e.g., Google, Infosys, TCS"
                                />
                                <Form.Control.Feedback type="invalid">{errors.companyName}</Form.Control.Feedback>
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
                                    isInvalid={!!errors.roleName}
                                    placeholder="e.g., Frontend Developer, QA Analyst"
                                />
                                <Form.Control.Feedback type="invalid">{errors.roleName}</Form.Control.Feedback>
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
                                    isInvalid={!!errors.jobLocation}
                                    placeholder="e.g., Chennai, TN - India"
                                />
                                <Form.Control.Feedback type="invalid">{errors.jobLocation}</Form.Control.Feedback>
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
                            isInvalid={!!errors.jobDescription}
                            placeholder="Enter job responsibilities, requirements, experience level, etc."
                        />
                        <Form.Control.Feedback type="invalid">{errors.jobDescription}</Form.Control.Feedback>
                    </Form.Group>

                    <div className="d-flex justify-content-between">
                        <Button variant="primary" type="submit" disabled={submitting}>
                            {submitting ? <Spinner size="sm" animation="border" /> : job ? 'Update Job' : 'Add Job'}
                        </Button>
                        {job && (
                            <Button variant="secondary" onClick={onCancel} disabled={submitting}>
                                Cancel
                            </Button>
                        )}
                    </div>
                </Form>
            </Card.Body>
        </div>
    );
};

export default JobForm; 