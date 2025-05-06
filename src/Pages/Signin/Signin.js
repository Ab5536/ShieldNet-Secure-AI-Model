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
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const SigninRouting = async () => {
    const form = new FormData();
    for (let key in formData) {
      form.append(key, formData[key]);
    }

    try {
      alert(backendURL + "/api/signin"); // For debugging env var
      const response = await axios.post(`${backendURL}/api/signin`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        const { user, token } = response.data;

        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("username", user.name);
        localStorage.setItem("email", user.email);
        localStorage.setItem("token", token);

        setError("");
        alert("✅ Welcome back, " + user.name + "!");
        navigate("/");
      } else {
        const msg = response.data.error || "Something went wrong. Please try again.";
        setError(msg);
      }
    } catch (error) {
      console.error(error);
      if (error.response) {
        let msg;
        const status = error.response.status;
        if (status === 400) msg = "Please fill in all required fields.";
        else if (status === 404) msg = "No account found with this email.";
        else if (status === 401) msg = "Incorrect password. Please try again.";
        else if (status === 500) msg = "Server error. Please try again later.";
        else msg = "Something went wrong. Please try again.";
        setError(msg);
      } else {
        setError("Unable to connect. Please try again later.");
      }
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (formData.email && formData.password) {
      SigninRouting();
    } else {
      setError("Please fill in all required fields.");
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
          Don't have an account?
          <span onClick={() => navigate("/signup")} className="signup-text">
            {" "}Sign up
          </span>
        </p>

        <p className="back-link" onClick={() => navigate(-1)}>
          ← Back
        </p>
      </div>
    </div>
  );
};

export default Signin;
