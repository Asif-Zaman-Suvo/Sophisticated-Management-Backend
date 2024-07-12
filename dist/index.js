"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
// Enable CORS
app.use((0, cors_1.default)({
    origin: "https://sophisticated-file-management-frontend.vercel.app",
    methods: "GET,POST",
}));
// gSet up multer for file uploads
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
app.post("/api/upload", upload.single("file"), (req, res) => {
    try {
        if (!req.file) {
            console.error("No file uploaded");
            return res.status(400).json({ error: "No file uploaded" });
        }
        const filePath = `/uploads/${req.file.filename}`;
        console.log("File uploaded:", filePath);
        res.status(200).json({ filePath: filePath });
    }
    catch (error) {
        console.error("Error during file upload:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
