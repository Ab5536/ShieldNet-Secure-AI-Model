import React from "react";
import "./Doctor.css";

const Doctor = () => {
  return (
    <div className="doctor-container">
      <h2 className="doctor-h1">Meet Our Expert Doctors</h2>

      <div className="doctor-content-container">
        <div className="doctor-card">
          <div className="image-container">
            <img
              src={require("./Images/fiza.jpg")}
              alt="Doctor 1"
              className="doctor-img"
            />
          </div>
          <h3 className="doctor-name">Dr. Fiza Sana</h3>
          <h4 className="doctor-specialty">Dentist</h4>
        </div>

        <div className="doctor-card">
          <div className="image-container">
            <img
              src={require("./Images/ishaq.jpg")}
              alt="Doctor 2"
              className="doctor-img"
            />
          </div>
          <h3 className="doctor-name">Dr. Ishaq Khalid</h3>
          <h4 className="doctor-specialty">Senior Surgeon</h4>
        </div>
      </div>
    </div>
  );
};

export default Doctor;