import React, { useState } from "react";
import "./Review.css";

const initialReviews = [
  {
    name: "Muhammad Nadeem",
    feedback: "This service helped me identify a condition that I would have otherwise missed. Highly recommend!",
    rating: 5,
  },
  {
    name: "Parsa",
    feedback: "The consultation was quick, easy, and the advice was very helpful. Thank you for the amazing support!",
    rating: 4,
  },
  {
    name: "Burhan Taj",
    feedback: "I appreciate the timely service and accurate results. Will definitely use again.",
    rating: 4,
  },
  {
    name: "Javeria",
    feedback: "A bit slow in processing the results, but overall, I am happy with the experience.",
    rating: 3,
  },
];

const Reviews = () => {
  const [reviews, setReviews] = useState(initialReviews);
  const [formData, setFormData] = useState({ name: "", feedback: "", rating: 0 });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleRating = (rating) => {
    setFormData({ ...formData, rating });
    setErrors({ ...errors, rating: "" });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required.";
    if (!formData.feedback.trim()) newErrors.feedback = "Feedback is required.";
    if (formData.rating < 1) newErrors.rating = "Rating is required.";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setReviews([{ ...formData }, ...reviews]);
    setFormData({ name: "", feedback: "", rating: 0 });
    setErrors({});
    alert("✅ Thank you for your review!");
  };

  return (
    <section id="reviews">
      <h2>What Our Users Say</h2>
      <div className="reviews-container">
        {reviews.map((review, index) => (
          <div className="review-card" key={index}>
            <div className="review-header">
              <h3 className="reviewer-name">{review.name}</h3>
              <div className="review-rating">
                {[...Array(5)].map((_, idx) => (
                  <span key={idx} className={`star ${idx < review.rating ? "" : "empty"}`}>★</span>
                ))}
              </div>
            </div>
            <p className="review-feedback">{review.feedback}</p>
          </div>
        ))}
      </div>

      <div className="review-form">
        <h3>Submit Your Review</h3>
        <form onSubmit={handleSubmit} className="submit-review-form">
          <div className="form-group">
            <label htmlFor="name">Your Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && <p className="error">{errors.name}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="feedback">Your Feedback</label>
            <textarea
              id="feedback"
              name="feedback"
              value={formData.feedback}
              onChange={handleChange}
              rows="4"
            />
            {errors.feedback && <p className="error">{errors.feedback}</p>}
          </div>

          <div className="form-group">
            <label>Rating</label>
            <div className="stars">
              {[1, 2, 3, 4, 5].map((rating) => (
                <span
                  key={rating}
                  className={`star ${rating <= formData.rating ? "selected" : ""}`}
                  onClick={() => handleRating(rating)}
                >
                  ★
                </span>
              ))}
            </div>
            {errors.rating && <p className="error">{errors.rating}</p>}
          </div>

          <button type="submit" className="btn-submit">Submit Review</button>
        </form>
      </div>
    </section>
  );
};

export default Reviews;
