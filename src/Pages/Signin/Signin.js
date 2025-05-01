import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Signin.css";
import InputField from "./Inputfield/InputField";
import axios from "axios";

const Signin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Sign-in logic and API call
  const SigninRouting = async () => {
    try {
      const result = await axios.post("http://localhost:5000/api/signin", formData);
      if (result.status === 200) {
        console.log("Signin successful");
        
        navigate("/");
      } else if (result.status === 404) {
        setError("No user found with these credentials");
      } else if (result.status === 500) {
        setError("Server error, please try again later.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setError("An error occurred, please try again later.");
    }
  };

  // Form submission handler
  const submitHandler = (e) => {
    e.preventDefault();
    if (formData.email && formData.password) {
      SigninRouting();
    } else {
      setError("Please fill in all fields.");
    }
  };

  return (
    <div className="signin-container">
      <div className="signin-card">
        <h1 className="signin-title">Virtual Disease Detection</h1>
        <h2 className="signin-subtitle"></h2>
        <form className="signin-form" onSubmit={submitHandler}>
          <InputField
            name="email"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
          />
          <InputField
            name="password"
            type="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
          />
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="submit-button">
            Sign In
          </button>
        </form>
        <p className="signup-link">
          Don't have an account? <a href="/signup">Sign up</a>
        </p>
      </div>
    </div>
  );
};

export default Signin;
