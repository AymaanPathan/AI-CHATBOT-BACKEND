const express = require("express");
const dotEnv = require("dotenv");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const app = express();
const Auth = require("./src/Auth.js");
const chatRoute = require("./src/Routes/chat.js");
const passwordAuth = require("./src/Controller/passwordAuth.js");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const userController = require("./src/Controller/Users.js");

app.use(
  cors({
    origin: "*",
    credentials: true,
    methods: ["GET", "POST"],
  })
);

dotEnv.config({
  path: "./.env",
});

// Image upload
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, `File-${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// MiddleWares
app.use(express.json());
// app.use(morgan("dev"));

// User Route
const MainRoute = express.Router();
MainRoute.get("/", (req, res) => {
  res.send("hello Web");
});
MainRoute.route("/register").post(userController.register);
MainRoute.route("/login").post(userController.login);
MainRoute.route("/users").get(userController.getAllUsers);
MainRoute.route("/chats").post(chatRoute);
MainRoute.route("/forgetPassword").post(passwordAuth.forgetPassword);
MainRoute.route("/resetPassword/:token").post(passwordAuth.resetPassword);
// App Routes

// Uploads
const uploadImg = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Please upload a file!" });
  }

  const filePath = req.file.path;

  // Initialize the Google Generative AI client
  const genAI = new GoogleGenerativeAI(
    "AIzaSyBqvG7BgojRbw0ZzUNyIICyUMu42t5-vI4"
  );

  // Retrieve the model
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

  const image = {
    inlineData: {
      data: fs.readFileSync(filePath).toString("base64"),
      mimeType: req.file.mimetype,
    },
  };

  try {
    const result = await model.generateContent([image]);
    res.status(200).json(result.response.text());
  } catch (error) {
    console.error("Error processing image:", error);
    res.status(500).json({ error: "Error processing image" });
  }
};

// Define the route for uploading
app.post("/upload", upload.single("file"), uploadImg);

app.use(MainRoute);

// Connection to DATABASE
const connectDb = async () => {
  try {
    const db =
      "mongodb+srv://aymaanpathan5:Kdac21dnostQzcQv@cluster0.wfjmx39.mongodb.net/aymaan";
    await mongoose.connect(db).then(() => console.log("DATABASE Connected🟢"));
  } catch (error) {
    console.log("Error While Connecting to DataBase🔴", error);
  }
};
connectDb();

const port = 8080;
app.listen(port, () => console.log("Server Started🟢"));
