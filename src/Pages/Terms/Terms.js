import React from "react";
import { useNavigate } from "react-router-dom"; // For routing and handling back button
import "./Terms.css";

const Terms = () => {
  const navigate = useNavigate(); // Hook to get history object

  // Function to handle back navigation
  const handleBackClick = () => {
    navigate(-1) // Goes back to the previous page
  };

  return (
    <div className="terms-container">
      <h1>Terms and Conditions</h1>
      <p>Effective Date: May 5, 2025</p>

      <h2>1. Acceptance of Terms</h2>
      <p>
        By accessing or using our platform, you agree to be bound by these Terms and Conditions and our Privacy Policy. If you do not agree, please do not use the platform.
      </p>

      <h2>2. Use of Service</h2>
      <p>
        Our platform is intended for informational and educational purposes only. Any medical advice provided is general in nature and should not be used as a substitute for professional consultation.
      </p>

      <h2>3. User Responsibilities</h2>
      <ul>
        <li>You must provide accurate and complete registration information.</li>
        <li>You are responsible for maintaining the confidentiality of your login credentials.</li>
        <li>You agree not to misuse the platform or attempt to disrupt its operations.</li>
      </ul>

      <h2>4. Privacy</h2>
      <p>
        We collect minimal user data only for the purpose of authentication and providing personalized content. We do not sell or share personal information with third parties.
      </p>

      <h2>5. Limitation of Liability</h2>
      <p>
        We are not liable for any damages or harm resulting from the use or inability to use our services, including reliance on any content provided.
      </p>

      <h2>6. Changes to Terms</h2>
      <p>
        We reserve the right to update these terms at any time. Changes will be posted on this page with the effective date.
      </p>

      <p>If you have any questions about these terms, please contact our support team.</p>

      {/* Back Button */}
      <button className="back-button" onClick={handleBackClick}>
        Back
      </button>
    </div>
  );
};

export default Terms;
