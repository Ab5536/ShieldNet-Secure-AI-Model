import React, { useState } from 'react';
import './Consultation.css';

const Consultation = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you would typically send form data to a server or API
        console.log('Form Submitted:', formData);
        alert('Consultation request submitted!');
        // Reset form after submission
        setFormData({
            name: '',
            email: '',
            phone: '',
            message: '',
        });
    };

    return (
        <section id="consultation">
            <div className="consultation-container">
                <h2>Doctor Consultation</h2>

                <h3>Consult with Us</h3>
                <form onSubmit={handleSubmit} className="consultation-form">
                    <div className="form-group">
                        <label htmlFor="name">Full Name</label>
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
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="phone">Phone Number (optional)</label>
                        <input
                            type="text"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="message">Message or Feedback</label>
                        <textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            rows="4"
                            required
                        ></textarea>
                    </div>
                    <button type="submit" className="btn-submit">
                        Submit Consultation Request
                    </button>
                </form>
            </div>
        </section>
    );
};

export default Consultation;
