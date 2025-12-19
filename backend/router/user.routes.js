import express from "express";
import { protect, adminOnly } from "../middleware/auth.js";
import { loginUser, logoutUser, registerUser } from "../controller/user.controller.js";
import { submitFeedback, getUserFeedbacks } from "../controller/feedback.controller.js";
import { getAllDemats } from "../controller/demat.controller.js";

const router = express.Router();

// USER ROUTES
router.get("/me", protect, (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
});

router.get("/all-demats", getAllDemats);
router.post("/register",registerUser)
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/submit", protect, submitFeedback);
router.get("/my-feedbacks", protect, getUserFeedbacks);


export default router;
