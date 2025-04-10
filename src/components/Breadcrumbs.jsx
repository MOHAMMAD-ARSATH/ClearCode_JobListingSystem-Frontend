import React from "react";
import { Breadcrumb, Container } from "react-bootstrap";
import { Link } from "react-router-dom";

const Breadcrumbs = ({ paths }) => {
  if (!paths || paths.length === 0) {
    return (
      <Container className="breadcrumbs-container">
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link to="/" className="breadcrumb-link">
              Home
            </Link>
          </Breadcrumb.Item>
        </Breadcrumb>
      </Container>
    );
  }

  return (
    <div className="breadcrumbs-wrapper">
      <Container className="breadcrumbs-container">
        <Breadcrumb>
          {paths.map((path, index) => (
            <Breadcrumb.Item key={index} active={index === paths.length - 1}>
              {index === paths.length - 1 ? (
                path.label
              ) : (
                <Link to={path.link} className="breadcrumb-link">
                  {path.label}
                </Link>
              )}
            </Breadcrumb.Item>
          ))}
        </Breadcrumb>
      </Container>
    </div>
  );
};

export default Breadcrumbs;