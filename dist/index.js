"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
// Enable CORS
app.use((0, cors_1.default)({
    origin: "http://sophisticated-file-management-frontend.vercel.app",
    methods: "GET,POST",
}));
// MongoDB connection
const mongoUri = process.env.DATABASE_URL || "";
mongoose_1.default
    .connect(mongoUri)
    .then(() => {
    console.log("Connected to MongoDB");
})
    .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
});
// Define a simple file schema
const fileSchema = new mongoose_1.default.Schema({
    filename: String,
    path: String,
    uploadedAt: {
        type: Date,
        default: Date.now,
    },
});
const File = mongoose_1.default.model("File", fileSchema);
// Set up multer for file uploads
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads"); // Destination folder relative to the root
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
const upload = (0, multer_1.default)({ storage: storage });
// Middleware to handle JSON responses
app.use(express_1.default.json());
// Serve static files from the /uploads directory
app.use("/uploads", express_1.default.static(path_1.default.join(__dirname, "uploads")));
// API endpoint to handle file uploads
app.post("/api/upload", upload.single("file"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        yield newFile.save();
        res.status(200).json({ filePath: filePath });
    }
    catch (error) {
        console.error("Error during file upload:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}));
// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
