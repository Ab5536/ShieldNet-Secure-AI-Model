import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import InputField from "../Signin/Inputfield/InputField";
import "./Signup.css";

const Signup = () => {
  const backendURL = process.env.REACT_APP_BACKEND_URI;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    password: "",
    email: "",
    gender: "",
    code: ""
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState("");
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [emailForOtp, setEmailForOtp] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setFieldErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "", // Clear error on change
    }));
  };

  const sendCode = async () => {
    try {
      const form = new FormData();
      for (let key in formData) {
        form.append(key, formData[key]);
      }
      if (validateForm) {
        const result = await axios.post(`${backendURL}/api/send-code`,
          { form },
          {
            headers: {
              "Content-Type": "multipart/form-data",
            }
          },);
        if (result.status === 200) {
          setError("");
          alert("Code Sent successfully to " + formData.email);
        }
        else if (result.status === 304) {
          alert("Previous Code not Expired Yet");
        }
        else {
          setError("Failed to send code.");
        }
      }
    } catch (error) {
      setError("An error occurred While sending Code.");
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

      if (result.status === 200) {
        setError("");
        const user = result.data.user;
        localStorage.setItem("user", JSON.stringify(user));
        navigate('/');
      } else if (result.status === 20) {
        alert("Resend OTP");
      }
      else if (result.status === 0) {
        alert("Invalid OTP");
      }
      else {
        setError("Signup failed. Try again.");
      }
    }
    catch (error) {
      console.error(error);
      setError("An error occurred. Please try again later.");
    }
  };

  const handleOtpVerification = async () => {
    try {
      const formData = new FormData();
      formData.append("email", emailForOtp);
      formData.append("otp", otp);

      const res = await axios.post(`${backendURL}/api/verify-otp`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (res.status === 200 && res.data.user) {
        const user = res.data.user;
        localStorage.setItem("user", JSON.stringify(user));
        navigate('/');
      }
    } catch (err) {
      console.error(err);
      setError("OTP verification failed.");
    }
  };

  const validateForm = () => {
    const { email, code, name, password, gender } = formData;
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
    const { code } = formData;

    if (validateForm()) {
      if (!code) {
        setFieldErrors({ code: "Code is missing." });
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

          <InputField
            name="name"
            type="text"
            placeholder="Enter Your Name"
            value={formData.name}
            onChange={handleChange}
          />
          {fieldErrors.name && <p className="error-message">{fieldErrors.name}</p>}

          <div className="password-container">
            <InputField
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter Your Password"
              value={formData.password}
              onChange={handleChange}
            />
            <button
              type="button"
              className="show-password-btn"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          {fieldErrors.password && <p className="error-message">{fieldErrors.password}</p>}

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

          <div className="send-code-container">
            <input
              type="number"
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder="Enter Code"
              className="code-input"
            />
            <button
              type="button"
              onClick={sendCode}
              className="send-code-btn"
            >
              Send Code
            </button>
          </div>
          {fieldErrors.code && <p className="error-message">{fieldErrors.code}</p>}

          {error && <p className="error-message">{error}</p>}

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

      {showOtpModal && (
        <div className="otp-modal">
          <div className="otp-box">
            <h1>Virtual Disease Detection</h1>
            <h2>Verify Your Email</h2>
            <p>An OTP has been sent to {emailForOtp}</p>
            <input
              type="number"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
            />
            <button className="submit-button" onClick={handleOtpVerification}>
              Verify OTP
            </button>
            <button className="cancel-button" onClick={() => setShowOtpModal(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Signup;
