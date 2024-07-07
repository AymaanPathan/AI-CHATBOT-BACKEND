const express = require("express");
const User = require("../Models/Users");
const crypto = require("crypto");
const sendEmail = require("../email");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const app = express();

app.use(express.json());
const resetToken = () => {
  const token = crypto.randomBytes(5).toString("hex");
  const hash = crypto.createHash("sha256").update(token).digest("hex");
  return { token, hash };
};

exports.forgetPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({
        Status: "Failed",
        Message: "No User Found With this Email",
      });
    }

    const { token, hash } = resetToken(); // Generate and hash token
    console.log("token: " + token, "hash: " + hash);
    user.ResetToken = hash; // Save hashed token to user's record
    user.ResetTokenExpires = Date.now() + 10 * 60 * 1000; // Set token expiration time (10 minutes)
    await user.save({ validateBeforeSave: false }); // Save user record

    const message = `You forgot your password? No worries! Here is your reset token: ${token}`;
    await sendEmail({
      email: user.email,
      subject: "Your Password Reset Token",
      message: message,
    });

    res.status(200).json({
      Status: "Success",
      Message: "Check your email for the reset token.",
    });
  } catch (error) {
    next(new Error("Server Error"));
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    // Finding the user
    const user = await User.findOne({
      ResetToken: hashedToken,
      ResetTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid token or token has expired",
      });
    }

    // Ensure password is hashed before saving
    const hashedPassword = await bcrypt.hash(req.body.password, 12);
    user.password = hashedPassword;
    user.confirmPassword = req.body.confirmPassword;
    user.ResetToken = undefined;
    user.ResetTokenExpires = undefined;
    await user.save();

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, "biggestpasswordever", {
      expiresIn: "9d",
    });

    res.status(200).json({
      status: "success",
      message: "Password changed successfully",
      token,
    });
  } catch (error) {
    next(error);
  }
};
