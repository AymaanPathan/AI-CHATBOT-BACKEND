const express = require("express");
const mongoose = require("mongoose");
const randomUUID = require("crypto");
const app = express();

const chatSchema = mongoose.Schema({
  Id: {
    type: String,
    default: randomUUID,
  },
  role: {
    type: String,
    default: "user",
  },
  content: {
    type: String,
    required: true,
  },
});

const Chats = mongoose.model("Chats", chatSchema);
module.exports = Chats;
