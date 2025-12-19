import express from "express";
import { protect, adminOnly } from "../middleware/auth.js";
import {
  getPendingUsers,
  getActiveDemats,
  getVerifiedUsers,
  verifyUser,
  getAllFeedbacks,
  addDemat,
  toggleDematStatus,
  getAllDematsAdmin,
  adminLogin,
  logoutUser,
  deleteDemat,
  getFeedbackUsersSummary,
  downloadUserFeedbackExcel,
} from "../controller/admin.controller.js";

const router = express.Router();

// 🔓 Public admin login
router.post("/login", adminLogin);
router.delete("/demat/:id", deleteDemat);

// 🔐 Protected admin routes
router.use(protect, adminOnly);

// logout
router.post("/logout", logoutUser);

// USERS
router.get("/users/pending", getPendingUsers);
router.get("/users/verified", getVerifiedUsers);
router.patch("/users/verify/:id", verifyUser);
router.get("/feedback/users", getFeedbackUsersSummary);
router.get("/feedback/download/:userId", downloadUserFeedbackExcel);

// DEMAT
router.post("/demat", addDemat);
router.get("/demats", getActiveDemats);
router.patch("/demat/:id", toggleDematStatus);

// FEEDBACK
router.get("/feedbacks", getAllFeedbacks);

export default router;
