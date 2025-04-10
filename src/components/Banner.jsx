import { Container, Button } from "react-bootstrap";
import UserNav from "./UserNav";

const Banner = () => {
  return (
    <div className="banner">
      <UserNav />

      <div className="banner-overlay d-flex align-items-center">
        <Container className="banner-content text-center">
          <p className="lead text-white">Find the career of your dreams</p>
          <h2 className="fw-bold mb-3">
            We're more than just a workplace. <br /> We're a family.
          </h2>
          <p className="text-white mb-4">
            We know that finding a meaningful and rewarding job can be a long
            journey. Our goal is to make that process as easy as possible for
            you, and to create a work environment that's satisfying - one where
            you'll look forward to coming to every day. Start your journey with
            us by browsing available jobs.
          </p>
          <Button
            className="banner-button px-4 py-2"
            variant="light"
            onClick={() => (window.location.hash = "#jobs")}
          >
            View Openings
          </Button>
        </Container>
      </div>
    </div>
  );
};

export default Banner;