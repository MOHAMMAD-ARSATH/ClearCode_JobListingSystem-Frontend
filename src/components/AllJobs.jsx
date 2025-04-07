import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card, Button, Row, Col, Badge, Spinner } from 'react-bootstrap';
import { ArrowRightCircle } from 'react-bootstrap-icons';

const AllJobs = () => {
    const API_URL = process.env.REACT_APP_API_URL;

    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`${API_URL}/api/job`)
            .then(response => {
                setJobs(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching jobs:', error);
                setLoading(false);
            });
    }, []);

    return (
        <div className="job-list-container" id="jobs">
            <h2 className="text-center mb-4">Current Openings</h2>

            {loading ? (
                <div className="text-center my-5">
                    <Spinner animation="border" role="status" variant="primary" />
                    <div className="mt-3">Loading... Please wait</div>
                </div>
            ) : (
                <Row xs={1} md={2} className="g-4 justify-content-center">
                    {jobs.map((job) => {
                        const lines = job.jobDescription.split('\n');
                        return (
                            <Col key={job._id} className="d-flex justify-content-center">
                                <Card
                                    className="job-card d-flex flex-column justify-content-between"
                                    onClick={() => navigate('/viewjob', { state: job })}
                                >
                                    <Card.Body>
                                        <Card.Title>{job.roleName}</Card.Title>
                                        <Card.Subtitle className="mb-2 text-muted">{job.companyName}</Card.Subtitle>

                                        <Card.Text className="job-description">
                                            {job.jobDescription && job.jobDescription.replace(/\s*\n\s*/g, ' ').trim().slice(0, 300)}...
                                            <span
                                                className="view-more"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate('/viewjob', { state: job });
                                                }}
                                            >
                                                View More
                                            </span>
                                        </Card.Text>

                                        <Card.Text className="text-muted">
                                            <strong>Location:</strong> {job.jobLocation}
                                        </Card.Text>
                                    </Card.Body>
                                    <Card.Footer className="card-footer-custom">
                                        <Badge bg="info" className="posted-badge">
                                            Posted on: {new Date(job.postedAt).toLocaleDateString()}
                                        </Badge>
                                        <Button
                                            variant="primary"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate('/applyjob', { state: job });
                                            }}
                                            className="apply-button"
                                        >
                                            Apply Now <ArrowRightCircle className="ms-2" />
                                        </Button>
                                    </Card.Footer>
                                </Card>
                            </Col>
                        );
                    })}
                </Row>
            )}
        </div>
    );
};

export default AllJobs;
