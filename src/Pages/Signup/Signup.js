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
    phoneNumber: "",
    cityName: "",
    gender: "",
  });

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
        setEmailForOtp(formData.email);
        setShowOtpModal(true);
        setError("");
      } else {
        setError("Signup failed. Try again.");
      }
    } catch (error) {
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
      console.log(res)
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

  const submitHandler = (e) => {
    
    e.preventDefault();
    if (validateForm()) {
      signUpRouting();
    } else {
      setError("Please fill in all the fields correctly.");
    }
  };

  const validateForm = () => {
    const { email, name, phoneNumber, password, cityName, gender } = formData;
    return (
      email &&
      name &&
      phoneNumber &&
      password &&
      cityName &&
      gender &&
      gender !== "Gender"
    );
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
          <InputField
            name="name"
            type="text"
            placeholder="Enter Your Name"
            value={formData.name}
            onChange={handleChange}
          />
          <InputField
            name="phoneNumber"
            type="tel"
            placeholder="Enter Your Phone Number"
            value={formData.phoneNumber}
            onChange={handleChange}
          />

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

          <InputField
            name="cityName"
            type="text"
            placeholder="Enter Your City"
            value={formData.cityName}
            onChange={handleChange}
          />

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

      {/* OTP Modal */}
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
