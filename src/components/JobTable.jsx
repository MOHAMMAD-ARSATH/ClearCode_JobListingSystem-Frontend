import React, { useState, useEffect } from "react";
import {
  Modal,
  Button,
  Pagination,
  Form,
  Row,
  Col,
  Spinner,
} from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";

const JobTable = ({ jobs, onEdit, onDelete }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedDescription, setSelectedDescription] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchField, setSearchField] = useState("jobId");
  const [searchValue, setSearchValue] = useState("");
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const rowsPerPage = 5;

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => {
      const lowerSearch = searchValue.toLowerCase();

      const filtered = jobs.filter((job) => {
        let field = "";
        switch (searchField) {
          case "jobId":
            field = job.jobId || "";
            break;
          case "companyName":
            field = job.companyName || "";
            break;
          case "roleName":
            field = job.roleName || "";
            break;
          case "jobLocation":
            field = job.jobLocation || "";
            break;
          default:
            break;
        }
        return field.toLowerCase().includes(lowerSearch);
      });

      setFilteredJobs(filtered);
      setCurrentPage(1);
      setLoading(false);
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchField, searchValue, jobs]);

  const handleDescriptionClick = (desc) => {
    setSelectedDescription(desc);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedDescription("");
  };

  const totalPages = Math.ceil(filteredJobs.length / rowsPerPage);
  const currentJobs = filteredJobs.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div>
      <Row className="mb-3 mt-2 align-items-center">
        <Col xs={12} md={4} className="mb-2">
          <Form.Select
            value={searchField}
            onChange={(e) => setSearchField(e.target.value)}
          >
            <option value="jobId">Job ID</option>
            <option value="companyName">Company Name</option>
            <option value="roleName">Role</option>
            <option value="jobLocation">Location</option>
          </Form.Select>
        </Col>
        <Col xs={12} md={8} className="mb-2">
          <Form.Control
            type="text"
            placeholder="Search..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </Col>
      </Row>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p>Loading applications...</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table job-table table-bordered table-hover">
            <thead className="table-dark">
              <tr>
                <th>S.No.</th>
                <th>Job Code</th>
                <th>Company Name</th>
                <th>Role</th>
                <th>Job Description</th>
                <th>Location</th>
                <th>Actions</th>
              </tr>
            </thead>

            {filteredJobs.length === 0 ? (
              <tbody>
                <tr>
                  <td colSpan="7" className="text-center py-4">
                    No jobs available.
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody>
                {currentJobs.map((job, index) => (
                  <tr key={job._id}>
                    <td>{(currentPage - 1) * rowsPerPage + index + 1}</td>
                    <td>{job.jobId}</td>
                    <td>{job.companyName}</td>
                    <td>{job.roleName}</td>
                    <td>
                      <button
                        className="btn btn-link p-0 text-primary"
                        onClick={() =>
                          handleDescriptionClick(job.jobDescription)
                        }
                      >
                        View Description
                      </button>
                    </td>
                    <td>{job.jobLocation}</td>
                    <td>
                      <div className="d-flex justify-content-center gap-3 flex-wrap">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => onEdit(job)}
                          title="Edit"
                        >
                          <FaEdit />
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => onDelete(job._id)}
                          title="Delete"
                        >
                          <FaTrash />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <Pagination className="justify-content-center mt-3">
          {[...Array(totalPages)].map((_, index) => (
            <Pagination.Item
              key={index + 1}
              active={index + 1 === currentPage}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </Pagination.Item>
          ))}
        </Pagination>
      )}

      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Job Description</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p style={{ whiteSpace: "pre-wrap" }}>{selectedDescription}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default JobTable;