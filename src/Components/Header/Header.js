import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-scroll";
import "./Header.css";
import logo from "../../images/logo.png";

const Header = () => {
  const route = useNavigate();

  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const storedUsername = localStorage.getItem("username");

    if (storedUser) {
      setUser(storedUser);
      setUsername(storedUsername || storedUser.name);
    } else {
      setUser(null);
      setUsername("");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    localStorage.removeItem("token"); // If using token-based auth
    setUser(null);
    setUsername("");
    route("/");
  };

  return (
    <header className="header-Homepage">
      <div className="logo-container">
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
            <span className="username">Hi, {username}</span>
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <button className="logout-button" onClick={() => route("/signin")}>
            Sign In
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
