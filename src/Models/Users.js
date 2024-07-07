const express = require("express");
const mongoose = require("mongoose");
const validator = require("validator");
const app = express();

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required for register"],
  },
  email: {
    type: String,
    required: true,
    validate: [validator.isEmail, "Please enter a Valid Email "],
  },
  password: {
    type: String,
    required: true,
  },
  chats: {
    type: mongoose.Schema.ObjectId,
    ref: "Chats",
  },
  ResetToken: String,
  ResetTokenExpires: Date,
});
const User = mongoose.model("User", userSchema);
module.exports = User;
