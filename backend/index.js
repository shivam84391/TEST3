import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import database from "./database/index.js";

// // Routes import
import userRoutes from "./router/user.routes.js";
import admin from "./router/admin.routes.js";
// import adminRoutes from "./router/admin.routes.js"; 
// import prompt from "./router/prompt.routes.js";

dotenv.config();

const app = express();

// Ensure database connection is established
 // Make sure this actually connects
 database
//CORS setup
app.use(
  cors({
    origin: "http://localhost:5173", // frontend (Vite)
    credentials: true,
     methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
// app.use("./static", express.static(path.join(__dirname, "static")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// // Mount routes
app.use("/api/users", userRoutes);
app.use("/api/admin",admin);
// app.use("/api/admin", adminRoutes);
// app.use("/api/prompt",prompt);

// // Default route
// app.get("/", (req, res) => {
//   res.send("API is running...");
// });

app.listen(process.env.PORT || 4000, () => {
  console.log("Server is running on port 4000");
});
