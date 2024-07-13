import express, { Request, Response } from "express";
import multer, { Multer } from "multer";
import path from "path";
import cors from "cors";
import mongoose from "mongoose";
import { RequestHandler } from "express-serve-static-core";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS
app.use(
  cors({
    origin: "http://sophisticated-file-management-frontend.vercel.app",
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

// Define a simple file schema
const fileSchema = new mongoose.Schema({
  filename: String,
  path: String,
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

const File = mongoose.model("File", fileSchema);

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads"); // Destination folder relative to the root
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload: Multer = multer({ storage: storage });

// Middleware to handle JSON responses
app.use(express.json() as RequestHandler);

// Serve static files from the /uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API endpoint to handle file uploads
app.post(
  "/api/upload",
  upload.single("file"),
  async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        console.error("No file uploaded");
        return res.status(400).json({ error: "No file uploaded" });
      }

      const filePath = `/uploads/${req.file.filename}`;
      console.log("File uploaded:", filePath);

      // Save file info to MongoDB
      const newFile = new File({
        filename: req.file.filename,
        path: filePath,
      });
      await newFile.save();

      res.status(200).json({ filePath: filePath });
    } catch (error) {
      console.error("Error during file upload:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
