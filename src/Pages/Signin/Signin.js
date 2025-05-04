import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Signin.css";
import InputField from "./Inputfield/InputField";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Signin = () => {
  const backendURL = process.env.REACT_APP_BACKEND_URI;
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const SigninRouting = async () => {
    const form = new FormData();
    for (let key in formData) {
      form.append(key, formData[key]);
    }

    try {
      const result = await axios.post(`${backendURL}/api/signin`, form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (result.status === 200) {
        const user = result.data.user;
        localStorage.setItem("user", JSON.stringify(user));
        setError(""); // Clear previous error
        alert("✅ User signed in successfully!");
        navigate("/");
      } else if (result.status === 404) {
        const msg = "No user found with these credentials";
        setError(msg);
        alert(msg);
      } else if (result.status === 500) {
        const msg = "Server error, please try again later.";
        setError(msg);
        alert(msg);
      }
    } catch (error) {
      console.error("Error during login:", error);
      const msg = "An error occurred, please try again later.";
      setError(msg);
      alert(msg);
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (formData.email && formData.password) {
      SigninRouting();
    } else {
      const msg = "Please fill in all fields.";
      setError(msg);
      alert(msg);
    }
  };

  return (
    <div className="signin-container">
      <div className="signin-card">
        <h1 className="signin-title">Virtual Disease Detection</h1>

        {error && <div className="error-alert">❌ {error}</div>}

        <form className="signin-form" onSubmit={submitHandler}>
          <InputField
            name="email"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
          />

          <div className="password-wrapper">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <span className="eye-icon" onClick={togglePasswordVisibility}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <button type="submit" className="submit-button">
            Sign In
          </button>
        </form>

        <p className="signup-link">
          Don't have an account? <a href="/signup">Sign up</a>
        </p>
        <p className="back-link" onClick={() => navigate(-1)}>
          ← Back to Previous Page
        </p>
      </div>
    </div>
  );
};

export default Signin;
