const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const useController = require("../Controller/Users");

/////////GEMINI////
const genAI = new GoogleGenerativeAI("AIzaSyDRs_DLxeryzO9RqvSu14nQ6rf04A4rMSg");

const Api = async (req, res) => {
  try {
    const generationConfig = {
      stopSequences: ["red"],
      maxOutputTokens: 200,
      temperature: 0.9,
      topP: 0.1,
      topK: 16,
    };
    const model = genAI.getGenerativeModel({
      model: "gemini-pro",
      generationConfig,
    });

    const prompt = req.body.prompt;
    if (!prompt) {
      return res.status(404).json("Please provide input");
    }

    const result = await model.generateContentStream(prompt);
    const response = await result.response;
    const text = response.text();
    res.json(text);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = Api;
