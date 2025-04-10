import React, { useState, useRef } from "react";
import { Card, Tab, Tabs, Spinner } from "react-bootstrap";
import { ToastContainer } from "react-toastify";

import UserNav from "../components/UserNav";
import ManageJobs from "../components/ManageJobs";
import JobForm from "../components/JobForm";
import ApplicationTable from "../components/ApplicationTable";

const AdminPanel = () => {
  const [loading, setLoading] = useState(false);
  const tableContainerRef = useRef(null);

  return (
    <div className="admin-panel">
      <UserNav />
      <div className="admin-panel-wrapper mt-5">
        <ToastContainer position="top-right" autoClose={3000} />
        <h1 className="admin-title">Admin Panel</h1>
        <Card className="admin-card">
          <Card.Body>
            <Tabs
              defaultActiveKey="jobtable"
              transition={false}
              id="admin-tabs"
              className="mb-3"
            >
              <Tab eventKey="jobtable" title="Job List">
                {loading ? (
                  <div className="text-center my-4">
                    <Spinner animation="border" variant="primary" size="lg" />
                    <h5 className="mt-2">Loading data... Please Wait</h5>
                  </div>
                ) : (
                  <div className="table-container" ref={tableContainerRef}>
                    <ManageJobs setLoading={setLoading} />
                  </div>
                )}
              </Tab>

              <Tab eventKey="addnewjob" title="Create Job">
                <div className="table-container" ref={tableContainerRef}>
                  <JobForm />
                </div>
              </Tab>

              <Tab eventKey="applicationtable" title="Application List">
                {loading ? (
                  <div className="text-center my-4">
                    <Spinner animation="border" variant="primary" size="lg" />
                    <h5 className="mt-2">Loading data... Please Wait</h5>
                  </div>
                ) : (
                  <div className="table-container" ref={tableContainerRef}>
                    <ApplicationTable setLoading={setLoading} />
                  </div>
                )}
              </Tab>
            </Tabs>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default AdminPanel;