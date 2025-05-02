// src/Components/Header/Header.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css";
import logo from "../../images/logo.png";

const Header = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState(null);

  // Check login status from localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.name) {
      setUserName(user.name);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUserName(null);
    navigate("/signin");
  };

  return (
    <header className="header-Homepage">
      <div className="logo-container">
        <img src={logo} alt="Disease Detection System Logo" className="logo" />
      </div>
      <h1>Disease Detection</h1>
      <nav>
        <ul className="header-items-Homepage">
          <li><a href="#first-Section">Home</a></li>
          <li><a href="#model-section">TB Detection</a></li>
          <li><a href="#Consult">Consultation</a></li>
          {userName ? (
            <>
              <li><strong>{userName}</strong></li>
              <li onClick={handleLogout}>Logout</li>
            </>
          ) : (
            <>
              <li onClick={() => navigate("/signin")}>Signin</li>
              <li onClick={() => navigate("/signup")}>Signup</li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
