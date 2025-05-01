import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import InputField from "../Signin/Inputfield/InputField"; // Importing the InputField component
import "./Signup.css";

const Signup = () => {
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const signUpRouting = async () => {
    try {
      const result = await axios.post(
        "http://localhost:5000/api/signup",
        formData
      );
      if (result.status === 200) {
        navigate("/");
      } else {
        setError("Signup Failed");
      }
    } catch (error) {
      console.error(error);
      setError("An error occurred. Please try again later.");
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
          <InputField
            name="password"
            type="password"
            placeholder="Enter Your Password"
            value={formData.password}
            onChange={handleChange}
          />
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
      </div>
    </div>
  );
};

export default Signup;
