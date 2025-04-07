import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Slider from 'react-slick';
import { Card, Button } from 'react-bootstrap';
import { ArrowRightCircle } from 'react-bootstrap-icons';

const JobCard = () => {
    const API_URL = process.env.REACT_APP_API_URL ;

    const [jobs, setJobs] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`${API_URL}/api/job`)
            .then(response => {
                const sortedJobs = [...response.data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setJobs(sortedJobs.slice(0, 6));
            })
            .catch(error => console.error('Error fetching jobs:', error));
    }, []);

    const cleanDescription = (desc) => {
        if (!desc) return '';
        const cleaned = desc.replace(/[\r\n]+/g, ' ').trim();
        return cleaned.length > 160 ? cleaned.slice(0, 157) + '...' : cleaned;
    };

    const getSlidesToShow = () => {
        if (jobs.length >= 3) return 3;
        if (jobs.length === 2) return 2;
        return 1;
    };

    const sliderSettings = {
        dots: true,
        infinite: jobs.length > getSlidesToShow(),
        speed: 700,
        slidesToShow: getSlidesToShow(),
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        arrows: true,
        cssEase: 'ease-in-out',
        appendDots: dots => (
            <div style={{ marginTop: '20px' }}>
                <ul style={{ margin: '0px' }}>{dots}</ul>
            </div>
        ),
        responsive: [
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: Math.min(getSlidesToShow(), 2),
                },
            },
            {
                breakpoint: 576,
                settings: {
                    slidesToShow: 1,
                    arrows: false,
                },
            },
        ],
    };

    return (
        <div className="job-slider-container">
            <h4 className="text-start m-4">Recently Posted Jobs</h4>
            <Slider {...sliderSettings} className="custom-slider">
                {jobs.map((job) => (
                    <div key={job._id} className="px-2">
                      <Card className="job-card-slider position-relative" onClick={() => navigate('/viewjob', { state: job })}>
    <Card.Body className="d-flex flex-column justify-content-between">
        <div>
            <Card.Title className="fs-5">{job.roleName}</Card.Title>
            <Card.Subtitle className="mb-1 text-muted">{job.companyName}</Card.Subtitle>
            <Card.Text className="text-muted mb-2">
                <strong>Location:</strong> {job.jobLocation}
            </Card.Text>
            <Card.Text className="mb-3">
                {cleanDescription(job.jobDescription)}
            </Card.Text>
        </div>
        <div className="d-flex justify-content-end mt-auto">
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
        </div>
    </Card.Body>
</Card>

                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default JobCard;
