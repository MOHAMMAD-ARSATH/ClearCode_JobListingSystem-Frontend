import { useState } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";

const UserNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [expanded, setExpanded] = useState(false);

  const handleNavClick = (path) => {
    setExpanded(false);

    if (path === "/#jobs") {
      if (location.pathname !== "/") {
        navigate("/", { replace: false });
        setTimeout(() => {
          document
            .getElementById("jobs")
            ?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      } else {
        document.getElementById("jobs")?.scrollIntoView({ behavior: "smooth" });
      }
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
      className="px-4 py-2 position-absolute w-100 top-0 z-3"
      id="nav"
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
              Home
            </Nav.Link>
            <Nav.Link
              className="nav-item-link"
              onClick={() => handleNavClick("/#jobs")}
            >
              Jobs
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default UserNav;