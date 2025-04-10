import React from "react";
import { ArrowUpCircleFill } from "react-bootstrap-icons";

import Banner from "../components/Banner";
import AllJobs from "../components/AllJobs";
import JobCard from "../components/JobCard";

const UserPanel = () => {
  const scrollToTop = () => {
    const navElement = document.getElementById("nav");
    if (navElement) {
      navElement.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div>
      <Banner />
      <AllJobs />
      <JobCard />
      <button className="scroll-top-btn" onClick={scrollToTop}>
        <ArrowUpCircleFill size={36} />
      </button>
    </div>
  );
};

export default UserPanel;
