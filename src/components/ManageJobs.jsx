import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Button, Modal } from "react-bootstrap";
import axios from "axios";

import JobTable from "./JobTable";
import JobForm from "./JobForm";

const ManageJobs = () => {
  const API_URL = process.env.REACT_APP_API_URL;

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);

  const [showConfirm, setShowConfirm] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/job`);
      setJobs(response.data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  const handleEdit = (job) => {
    setSelectedJob({ ...job });
  };

  const confirmDelete = (id) => {
    setJobToDelete(id);
    setShowConfirm(true);
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await axios.delete(`${API_URL}/api/job/${jobToDelete}`);
      toast.success("Job deleted successfully!");
      fetchJobs();
    } catch (error) {
      console.error("Error deleting job:", error);
    } finally {
      setShowConfirm(false);
      setJobToDelete(null);
    }
    setLoading(false);
  };

  const handleFormSuccess = () => {
    setSelectedJob(null);
    fetchJobs();
  };

  const handleCancelEdit = () => {
    setSelectedJob(null);
  };

  return (
    <>
      <div className="manage-jobs-wrapper">
        {!selectedJob ? (
          <JobTable
            jobs={jobs}
            onEdit={handleEdit}
            onDelete={confirmDelete}
            loading={loading}
          />
        ) : (
          <JobForm
            job={selectedJob}
            onSuccess={handleFormSuccess}
            onCancel={handleCancelEdit}
          />
        )}
      </div>

      <Modal show={showConfirm} onHide={() => setShowConfirm(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this job?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirm(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ManageJobs;