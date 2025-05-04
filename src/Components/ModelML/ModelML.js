import React, { useState } from "react";
import axios from "axios";
import "./ModelML.css";

const ModelML = () => {
  const backendURL = process.env.REACT_APP_BACKEND_URI || "http://localhost:5000";
  const [selectedImage, setSelectedImage] = useState(null);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  // Retrieve user email from local storage
  const userEmail = localStorage.getItem("email"); // Make sure you are storing the user's email as "userEmail"

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setSelectedImage(URL.createObjectURL(file));
    setResult("Analyzing image...");
    setLoading(true);

    // Create a new FormData object
    const formData = new FormData();
    formData.append("image", file);

    // Append user email from localStorage
    if (userEmail) {
      formData.append("email", userEmail);
    } else {
      setResult("❌ Error: User email not found.");
      setLoading(false);
      return;
    }

    try {
      // Send the form data to the backend using Axios
      const response = await axios.post(`${backendURL}/api/predict`, formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Ensure we send the data as multipart/form-data
        },
      });

      // Check if response is successful
      if (response.status === 200) {
        setResult(response.data.prediction || "No disease detected.");
      } else {
        throw new Error("Prediction failed");
      }
    } catch (error) {
      setResult(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="model-container">
      <h1 className="model-h1">Upload Pics Here For Disease Detection</h1>

      <div className="content-container">
        <div className="left-panel">
          <h3>Upload Image</h3>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="file-input"
          />
        </div>

        <div className="center-panel">
          {selectedImage ? (
            <img src={selectedImage} alt="Uploaded" className="preview-img" />
          ) : (
            <p>No Image Uploaded</p>
          )}
        </div>

        <div className="right-panel">
          <h3>Disease Outcome</h3>
          {loading ? (
            <p>Analyzing...</p>
          ) : (
            <textarea
              value={result}
              readOnly
              placeholder="Result will appear here..."
              className="result-box"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ModelML;
