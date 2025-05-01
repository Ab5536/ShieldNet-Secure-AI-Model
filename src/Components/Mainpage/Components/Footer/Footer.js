import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer>
      <div className="container">
        <h2>Virtual Disease Detection</h2>
        <p>Empowering early disease detection with cutting-edge technology.</p>
        <ul>
          <li>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              Twitter
            </a>
          </li>
          <li>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              Facebook
            </a>
          </li>
          <li>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
          </li>
        </ul>
        <p className="copy">&copy; {new Date().getFullYear()} Virtual Disease Detection. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
