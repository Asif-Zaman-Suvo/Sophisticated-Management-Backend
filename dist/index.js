"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const upload_1 = __importDefault(require("./api/upload")); // Import the upload route
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
// Enable CORS
app.use((0, cors_1.default)({
    origin: "https://sophisticated-file-management-frontend.vercel.app",
    credentials: true,
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
// Middleware to handle JSON responses
app.use(express_1.default.json());
// Use the upload route
app.use("/api", upload_1.default);
// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
