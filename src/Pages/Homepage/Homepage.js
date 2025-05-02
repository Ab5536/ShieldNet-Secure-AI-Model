import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./Homepage.css";
import Header from "../../Components/Header/Header";
import ModelML from "../../Components/ModelML/ModelML";
import Blog from "../../Components/Blog/Blog";
import Doctor from "../../Components/Doctor/Doctor";
import Reviews from "../../Components/Reviews/Review";
import Consultation from "../../Components/Consultation/Consultation";
import Footer from "../../Components/Footer/Footer";
import logo from "../../images/logo.png";

import { Navigate, useNavigate } from "react-router-dom";

const Homepage = () => {
  const route = useNavigate();
  const scrollToDoctorSection = () => {
    const section = document.getElementById("doctor-section");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <div className="Homepage">
      <Header />
      
      <main>
        
        <section id="first-Section" className="first-section">
          <div className="first-text">
            <span className="subheading">Best Treatment in Town</span>
            <h1>Your Health, Our Priority</h1>
            <p>
              Benefit from expert medical guidance and innovative treatment
              approaches
            </p>
            <button className="btn-consult-us" onClick={scrollToDoctorSection}>
              Consult Us
            </button>
          </div>
        </section>

        <section id="model-section">
          <ModelML />
        </section>

        <section id="doctor-section" className="Doctor-Section">
          <Doctor />
        </section>
        <Blog />
        <Consultation id="Consult" />
        <Reviews />
        <Footer />
      </main>
    </div>
  );
};

export default Homepage;
