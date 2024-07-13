import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import uploadRouter from "./api/upload"; // Import the upload route

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS
app.use(
  cors({
    origin: "https://sophisticated-file-management-frontend.vercel.app",
    credentials: true,
    methods: "GET,POST",
  })
);

// MongoDB connection
const mongoUri = process.env.DATABASE_URL || "";
mongoose
  .connect(mongoUri)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

// Middleware to handle JSON responses
app.use(express.json());

// Use the upload route
app.use("/api", uploadRouter);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
