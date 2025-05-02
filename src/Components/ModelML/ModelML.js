import React, { useState } from "react";
import "./ModelML.css";

const ModelML = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      setResult("Analyzing image...");

      const formData = new FormData();
      formData.append("image", file);

      try {
        setLoading(true); 
        const response = await fetch("http://127.0.0.1:5000/predict", {
          method: "POST",
          body: formData,
        });
          console.log(response)
        if (!response.ok) {
          throw new Error("Failed to Model");
        }

        const data = await response.json();
        setResult(data.prediction || "No disease detected."); 
      } 
      catch (error) {
        setResult(`Error: ${error.message+"Hello its Kamran"}`); 
      } finally {
        setLoading(false);
      }
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
