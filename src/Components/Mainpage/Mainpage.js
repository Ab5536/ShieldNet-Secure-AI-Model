import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./Mainpage.css";
import ModelML from "./Components/ModelML/ModelML";
import Consultation from "./Components/Consultation/Consultation";
import Chatbot from "./Components/ChatbotAI/ChatbotAI";
import Home from "./Components/Home/Home";
import { Navigate, useNavigate } from "react-router-dom";
import logo from "./images/logo.png";
import Blog from "./Components/Blog/Blog";
import Doctor from "./Components/Doctor/Doctor";
import Footer from "./Components/Footer/Footer";
import Reviews from "./Components/Reviews/Review";
const Mainpage = () => {
  const route = useNavigate();
  const scrollToDoctorSection = () => {
    const section = document.getElementById("doctor-section");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <div className="mainpage">
      <header className="header-mainpage">
        <div className="logo-container">
          <img
            src={logo}
            alt="Disease Detection System Logo"
            className="logo"
          />
        </div>
        <h1>Disease Detection </h1>
        <nav>
          <ul className="header-items-mainpage">
            <li>
              <a href="#first-Section">Home</a>
            </li>
            <li>
              <a href="#model-section">TB Detection</a>
            </li>
            <li>
              <a href="#Consult">Consultation</a>
            </li>
            <li
              onClick={() => {
                route("/signin");
              }}
            >
              Signin
            </li>
            <li
              onClick={() => {
                route("/signup");
              }}
            >
              Signup
            </li>
          </ul>
        </nav>
      </header>

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
        {/* <section id="home-section">
          <Home />
        </section> */}
        <section id="model-section">
          <ModelML />
        </section>

        <section id="doctor-section" className="Doctor-Section">
          <Doctor />
        </section>
        <Blog />
        <Consultation id="Consult"/>
        <Reviews/>
        <Footer />
      </main>
    </div>
  );
};

export default Mainpage;
