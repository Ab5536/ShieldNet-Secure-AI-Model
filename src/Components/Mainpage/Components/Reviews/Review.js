import React, { useState } from 'react';
import './Review.css';

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
    const [formData, setFormData] = useState({
        name: '',
        feedback: '',
        rating: 0,
    });

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle rating click
    const handleRating = (rating) => {
        setFormData({ ...formData, rating });
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.name && formData.feedback && formData.rating) {
            const newReview = {
                name: formData.name,
                feedback: formData.feedback,
                rating: formData.rating,
            };
            setReviews([newReview, ...reviews]); // Add new review to the top of the list
            setFormData({ name: '', feedback: '', rating: 0 }); // Reset form
            alert('Thank you for your review!');
        } else {
            alert('Please fill out all fields and select a rating.');
        }
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
                                {Array(review.rating)
                                    .fill()
                                    .map((_, idx) => (
                                        <span key={idx} className="star">★</span>
                                    ))}
                                {Array(5 - review.rating)
                                    .fill()
                                    .map((_, idx) => (
                                        <span key={idx} className="star empty">★</span>
                                    ))}
                            </div>
                        </div>
                        <p className="review-feedback">{review.feedback}</p>
                    </div>
                ))}
            </div>

            {/* Review Submission Form */}
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
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="feedback">Your Feedback</label>
                        <textarea
                            id="feedback"
                            name="feedback"
                            value={formData.feedback}
                            onChange={handleChange}
                            rows="4"
                            required
                        ></textarea>
                    </div>

                    <div className="form-group">
                        <label>Rating</label>
                        <div className="stars">
                            {[1, 2, 3, 4, 5].map((rating) => (
                                <span
                                    key={rating}
                                    className={`star ${rating <= formData.rating ? 'selected' : ''}`}
                                    onClick={() => handleRating(rating)}
                                >
                                    ★
                                </span>
                            ))}
                        </div>
                    </div>

                    <button type="submit" className="btn-submit">Submit Review</button>
                </form>
            </div>
        </section>
    );
};

export default Reviews;
