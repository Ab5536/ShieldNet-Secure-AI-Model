import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import InputField from "../Signin/Inputfield/InputField";
import { FiEye, FiEyeOff } from "react-icons/fi";
import "./Signup.css";

const Signup = () => {
  const backendURL = process.env.REACT_APP_BACKEND_URI;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    password: "",
    email: "",
    gender: "",
    otp: "",
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setFieldErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const sendotp = async () => {
    try {
      const form = new FormData();
      for (let key in formData) {
        form.append(key, formData[key]);
      }
      if (validateForm()) {
        const result = await axios.post(`${backendURL}/api/send-otp`, form, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (result.status === 200) {
          setError("");
          alert("OTP sent successfully to " + formData.email);
        } else if (result.status === 304) {
          alert("Previous OTP not expired yet.");
        } else {
          alert("Failed to send OTP.");
        }
      }
    } catch (error) {
      alert("An error occurred while sending the OTP.");
    }
  };

  const signUpRouting = async () => {
    const form = new FormData();
    for (let key in formData) {
      form.append(key, formData[key]);
    }

    try {
      const result = await axios.post(`${backendURL}/api/signup`, form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (result.status === 201) {
        setError("");
        const user = result.data.user;
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("username", user.name);
        localStorage.setItem("email", user.email);
        alert("Signup successful!");
        navigate('/');
      } else if (result.status === 410) {
        alert("OTP has expired. Please request a new one.");
      } else if (result.status === 401) {
        alert("Invalid OTP. Please try again.");
      } else if (result.status === 404) {
        alert("No verification found for this email. Please sign up first.");
      } else if (result.status === 400) {
        alert("Bad request. Please check the entered values.");
      } else {
        alert("Signup failed. Try again.");
      }
    }
    catch (error) {
      console.error(error);
      alert("An error occurred. Please try again later.");
    }
  };

  const validateForm = () => {
    const { email, name, password, gender } = formData;
    const errors = {};

    if (!email) errors.email = "Email is required.";
    if (!name) errors.name = "Name is required.";
    if (!password) errors.password = "Password is required.";
    if (!gender) errors.gender = "Gender is required.";

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const submitHandler = (e) => {
    e.preventDefault();
    const { otp } = formData;

    if (validateForm()) {
      if (!otp) {
        setFieldErrors({ otp: "OTP is missing." });
        return;
      }
      if (!termsAccepted) {
        setError("You must accept the terms and conditions to proceed.");
        return;
      }
      signUpRouting();
    } else {
      setError("Please fill all the fields.");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleTermsChange = () => {
    setTermsAccepted(!termsAccepted);
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h1 className="signup-title">Create Your Account</h1>
        <form className="signup-form" onSubmit={submitHandler}>
          <InputField
            name="email"
            type="email"
            placeholder="Enter Your Email"
            value={formData.email}
            onChange={handleChange}
          />
          {fieldErrors.email && <p className="error-message">{fieldErrors.email}</p>}
          
          <div className="password-container">
            <InputField
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter Your Password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="new-password"
            />
            <button
              type="button"
              className="show-password-btn"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
          {fieldErrors.password && <p className="error-message">{fieldErrors.password}</p>}

          <InputField
            name="name"
            type="text"
            placeholder="Enter Your Name"
            value={formData.name}
            onChange={handleChange}
          />
          {fieldErrors.name && <p className="error-message">{fieldErrors.name}</p>}

          <select
            className="form-select"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          {fieldErrors.gender && <p className="error-message">{fieldErrors.gender}</p>}

          <div className="send-otp-container">
            <input
              type="number"
              name="otp"
              value={formData.otp}
              onChange={handleChange}
              placeholder="Enter OTP"
              className="otp-input"
            />
            <button
              type="button"
              onClick={sendotp}
              className="send-otp-btn"
            >
              Send OTP
            </button>
          </div>
          {fieldErrors.otp && <p className="error-message">{fieldErrors.otp}</p>}

          {error && <p className="error-message">{error}</p>}

          <div className="terms-container">
            <label className="terms-checkbox-label">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={handleTermsChange}
                required
              />
              <span className="checkbox-text">
                By signing up, you agree to our{" "}
                <Link to="/terms" className="terms-link">
                  Terms & Conditions
                </Link>
              </span>
            </label>
          </div>

          <button className="submit-button" type="submit">
            Sign Up
          </button>
        </form>

        <div className="back-to-menu-container">
          <Link to="/" className="back-to-menu-button">
            Back to Main Menu
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
