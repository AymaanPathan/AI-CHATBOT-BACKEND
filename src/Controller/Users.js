const express = require("express");
const User = require("../Models/Users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();
app.use(cookieParser("qwertyuiopp132237682"));

app.use(cors());
const errorFunction = (err, errCode) => {
  return (req, res) => {
    res.status(errCode).json({
      Status: "Failed",
      Error: err,
    });
  };
};
exports.getAllUsers = async (req, res) => {
  try {
    const AllUsers = await User.find();
    res.status(200).json({
      Status: "Success",
      Length: AllUsers.length,
      Data: {
        AllUsers,
      },
    });
  } catch (error) {
    console.log(error);
    errorFunction(error, 404)(req, res);
  }
};

// Register
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(401).json({
        Status: "failed",
        Message: "User is already exist",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const register = new User({ name, email, password: hashedPassword });
    await register.save();
    const token = jwt.sign({ id: register._id }, "qwertyuiopp132237682", {
      expiresIn: "7d",
    });
    const cookieOptions = {
      httpOnly: true,
    };
    res.cookie("jwt", token, cookieOptions);
    res.status(200).json({
      Status: "Success",
      Name: register.name,
      TOKEN: token,
    });
  } catch (error) {
    console.log(error);

    errorFunction(error.message, 404)(req, res);
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        Status: "Failed",
        Message: "User not Registered",
      });
    }
    const correctedPassword = await bcrypt.compare(password, user.password);
    if (!correctedPassword) {
      return res.status(401).json({
        Status: "Failed",
        Message: "Incorrect Password",
      });
    }
    // Sign the JWT token
    const token = jwt.sign({ id: user._id }, "qwertyuiopp132237682", {
      expiresIn: "7d",
    });
    const cookieOptions = {
      httpOnly: true,
    };
    res.cookie("jwt", token, cookieOptions);
    res.status(200).json({
      Message: "Success",
      Name: user.name,
      Data: user._id.toString(),
      TOKEN: token,
    });
  } catch (error) {
    console.log(error);
    errorFunction(error, 404)(req, res);
  }
};
