const mongoose = require("mongoose");

const connect = () => {
  return mongoose
    .connect("mongodb+srv://Abdullah:Abdullah4056@cluster0.amzpn.mongodb.net/Virtual-Disease-Detection")
    .then(() => {
      console.log("MongoDB Connected");
    })
    .catch((error) => {
      console.log("MongoDB connection Failed:", error);
      throw error; // Re-throw the error to handle it in server.js if needed
    });
};

module.exports = { connect };
