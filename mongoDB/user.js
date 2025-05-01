const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,// match: /.+\@.+\..+/ // Validates email format
  },
  name: {
    type: String,
   // required: true
  },
  phoneNumber: {
    type: String,
    //required: true
  },
  password: {
    type: String,
    required: true
  },
  city: {
    type: String,
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'], 
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
