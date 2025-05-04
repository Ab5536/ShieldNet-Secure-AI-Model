import React from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-scroll";  // Import Link from react-scroll
import "./Header.css";
import logo from "../../images/logo.png";

const Header = () => {
  const route = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const username = localStorage.getItem("username"); // Accessing the username from localStorage
  const email = localStorage.getItem("email"); // Accessing the email from localStorage

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("username"); // Remove username from localStorage
    localStorage.removeItem("email"); // Remove email from localStorage
    route("/");
  };

  return (
    <header className="header-Homepage">
      <div className="logo-container">
        {/* Clicking on the logo scrolls to the top */}
        <Link to="first-Section" smooth={true} duration={500}>
          <img src={logo} alt="Logo" className="logo" />
        </Link>
        <h1>
          <Link to="first-Section" smooth={true} duration={500}>
            Disease Detection
          </Link>
        </h1>
      </div>

      <nav className="nav-center">
        <ul className="nav-items">
          <li>
            {/* Scroll to the top (first section) */}
            <Link to="first-Section" smooth={true} duration={500}>
              Home
            </Link>
          </li>
          <li>
            <a href="#model-section">TB Detection</a>
          </li>
          <li>
            <a href="#Consult">Consultation</a>
          </li>
        </ul>
      </nav>

      <div className="nav-right">
        {user ? (
          <>
            <span className="username">Hi, {username}</span> {/* Display username */}
            {/* <span className="email">Email: {email}</span> Display email */}
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <button className="logout-button" onClick={() => route("/signin")}>
            Signin
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
