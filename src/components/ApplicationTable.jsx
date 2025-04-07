import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  Button,
  Modal,
  Spinner,
  Container,
  Pagination,
  Form,
  Row,
  Col,
} from "react-bootstrap";

const ApplicationTable = () => {
  const API_URL = process.env.REACT_APP_API_URL;

  const [applications, setApplications] = useState([]);
  const [filteredApps, setFilteredApps] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [modalShow, setModalShow] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchField, setSearchField] = useState("jobId");
  const [searchValue, setSearchValue] = useState("");

  const rowsPerPage = 5;

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/apply/applications`);
      setApplications(res.data);
      setFilteredApps(res.data);
    } catch (error) {
      console.error("Error fetching applications:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const openModal = (fileUrl) => {
    if (!fileUrl) {
      alert("File not found!");
      return;
    }
    setSelectedFile(fileUrl);
    setModalShow(true);
  };

  const closeModal = () => {
    setSelectedFile(null);
    setModalShow(false);
  };

  // Handle search input change
  useEffect(() => {
    const lowerSearch = searchValue.toLowerCase();

    const filtered = applications.filter((app) => {
      let field = "";

      switch (searchField) {
        case "jobId":
          field = app.jobs?.jobId || "";
          break;
        case "companyName":
          field = app.jobs?.companyName || "";
          break;
        case "roleName":
          field = app.jobs?.roleName || "";
          break;
        case "name":
          field = app.name || "";
          break;
        case "email":
          field = app.email || "";
          break;
        case "contact":
          field = app.contact || "";
          break;
        default:
          break;
      }

      return field.toLowerCase().includes(lowerSearch);
    });

    setFilteredApps(filtered);
    setCurrentPage(1);
  }, [searchValue, searchField, applications]);

  const totalPages = Math.ceil(filteredApps.length / rowsPerPage);
  const currentData = filteredApps.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );
  const handlePageChange = (page) => setCurrentPage(page);

  return (
    <Container fluid>
      <Row className="mb-3 mt-2 align-items-center">
        <Col xs={12} md={4} className="mb-2">
          <Form.Select
            value={searchField}
            onChange={(e) => setSearchField(e.target.value)}
          >
            <option value="jobId">Job ID</option>
            <option value="companyName">Company Name</option>
            <option value="roleName">Role</option>
            <option value="name">Name</option>
            <option value="email">Email</option>
            <option value="contact">Contact</option>
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

      {/* Table */}
      {loading ? (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p>Loading applications...</p>
        </div>
      ) : (
        <div className="table-responsive">
          <Table striped bordered hover className="application-table">
            <thead className="table-dark">
              <tr>
                <th>S.No.</th>
                <th>Job ID</th>
                <th>Company</th>
                <th>Role</th>
                <th>Name</th>
                <th>Email</th>
                <th>Contact</th>
                <th>Resume</th>
                <th>Cover Letter</th>
              </tr>
            </thead>
            <tbody>
              {currentData.length > 0 ? (
                currentData.map((app, index) => (
                  <tr key={app._id}>
                    <td>{(currentPage - 1) * rowsPerPage + index + 1}</td>
                    <td>{app.jobs?.jobId || "N/A"}</td>
                    <td>{app.jobs?.companyName || "N/A"}</td>
                    <td>{app.jobs?.roleName || "N/A"}</td>
                    <td>{app.name}</td>
                    <td>{app.email}</td>
                    <td>{app.contact}</td>
                    <td>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => openModal(app.resume)}
                      >
                        View
                      </Button>
                    </td>
                    <td>
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => openModal(app.coverLetter)}
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center py-4">
                    No applications found.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>

          {totalPages > 1 && (
            <Pagination className="justify-content-center">
              {[...Array(totalPages)].map((_, index) => (
                <Pagination.Item
                  key={index + 1}
                  active={currentPage === index + 1}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </Pagination.Item>
              ))}
            </Pagination>
          )}
        </div>
      )}

      <Modal show={modalShow} onHide={closeModal} size="lg" centered scrollable>
        <Modal.Header closeButton>
          <Modal.Title>Document Preview</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedFile ? (
            <iframe
              src={selectedFile}
              title="PDF Preview"
              width="100%"
              height="500px"
              frameBorder="0"
            />
          ) : (
            <p>No file selected.</p>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default ApplicationTable;
