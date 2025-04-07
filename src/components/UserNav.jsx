import { useState } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const UserNav = () => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  const handleNavClick = (path) => {
    setExpanded(false); // Collapse the menu after clicking
    if (path === "/#jobs") {
      window.location.href = path; // Navigate with hash
    } else {
      navigate(path);
    }
  };

  return (
    <Navbar
      expand="lg"
      expanded={expanded}
      bg="transparent"
      variant="dark"
      className="px-4 py-2 position-absolute w-100 top-0"
    >
      <Container fluid>
        <Navbar.Toggle
          aria-controls="basic-navbar-nav"
          onClick={() => setExpanded(!expanded)}
          className="border"
        />
        <Navbar.Collapse
          id="basic-navbar-nav"
          className={expanded ? "bg-white rounded shadow-sm mt-2 p-2" : ""}
        >
          <Nav className="ms-auto text-center w-100">
            <Nav.Link
              className="nav-item-link"
              onClick={() => handleNavClick("/")}
            >
              HOME
            </Nav.Link>
            <Nav.Link
              className="nav-item-link"
              onClick={() => handleNavClick("/#jobs")}
            >
              JOBS
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default UserNav;
