import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Homepage.css";
import Header from "../../Components/Header/Header";
import ModelML from "../../Components/ModelML/ModelML";
import Blog from "../../Components/Blog/Blog";
import Doctor from "../../Components/Doctor/Doctor";
import Reviews from "../../Components/Reviews/Review";
import Consultation from "../../Components/Consultation/Consultation";
import Footer from "../../Components/Footer/Footer";
import NewVisitor from "../../Components/Newvisitor/Newvisitor";

const Homepage = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token"); // Assumes JWT is saved as 'token'
    
    if (token) {
      // Use the backend URI from the environment variable
      const backendURI = process.env.REACT_APP_BACKEND_URI;

      // Send the token to the backend to verify its validity
      axios
        .get(`${backendURI}/api/verify-token`, { // Dynamic URL from .env
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          // If the token is valid, set the user data
          setUser({ name: response.data.name, email: response.data.email });
        })
        .catch((error) => {
          console.error("Token validation failed:", error);
          localStorage.removeItem("token"); // Remove invalid token from localStorage
        });
    }
  }, []);

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
            <span className="subheading">
              {user ? `Welcome, ${user.name}!` : "Best Treatment in Town"}
            </span>
            <h1>Your Health, Our Priority</h1>
            <p>
              {user
                ? "Access personalized insights and expert medical guidance tailored for you."
                : "Benefit from expert medical guidance and innovative treatment approaches"}
            </p>
            <button className="btn-consult-us" onClick={scrollToDoctorSection}>
              Consult Us
            </button>
          </div>
        </section>

        <section id="model-section">
          {user ? <ModelML /> : <NewVisitor />}
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
