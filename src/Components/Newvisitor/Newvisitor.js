import React from "react";
import { useNavigate } from "react-router-dom";
import "./NewVisitor.css";

const NewVisitor = () => {
  const navigate = useNavigate();

  return (
    <div className="new-visitor-container">
      <div className="new-visitor-content">
        <h1 className="visitor-heading">Welcome to Our Smart Health Platform</h1>
        <p className="visitor-subtext">
          Get personalized, AI-powered health predictions by signing in and exploring the power of data.
        </p>
        <button className="visitor-button" onClick={() => navigate("/signin")}>
          Sign In to Unlock Insights
        </button>
      </div>
    </div>
  );
};

export default NewVisitor;
