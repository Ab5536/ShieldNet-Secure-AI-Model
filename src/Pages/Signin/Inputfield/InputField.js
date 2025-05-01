// InputField.js
import React from "react";
import './InputField.css';

const InputField = ({ name, type = "text", placeholder, value, onChange }) => {
    return (
        <input
            className="signin-input"
            name={name}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            required
        />
    );
};

export default InputField;
