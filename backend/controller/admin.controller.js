/* =========================
   👤 USER MANAGEMENT
========================= */

// Pending users
import jwt from "jsonwebtoken";
import User from "../models/user.models.js";
import Demat from "../models/demat.model.js";
import Feedback from "../models/feedback.model.js";

import path from "path";

export const downloadUserFeedbackExcel = async (req, res) => {
  try {
    const { userId } = req.params;

    const feedbacks = await Feedback.find({ user: userId })
      .populate("user", "fullName email mobile gender customerId")
      .populate("dematAccount", "name")
      .sort({ createdAt: 1 });

    if (!feedbacks.length) {
      return res.status(404).json({
        success: false,
        message: "No feedback found",
      });
    }
    const rows = feedbacks.map((f, i) => ({
  "Id": i + 1,
  "Leads id": f.leadId || "",
  "Feedback type": f.feedbackType || "",
  "Selected demat": f.dematAccount?.name || "",
  "Feedback tone": f.feedbackTone || "",
  "Urgency level": f.urgencyLevel || "",

  "Full name": f.customerName || "",
  "Contact number": f.contactNumber || "",
  "Gender": f.gender || "",
  "Customer id": f.customerId || "",
  "Email": f.email || "",

  "Account opening date": f.accountOpeningDate
    ? f.accountOpeningDate.toISOString().split("T")[0]
    : "",

  "City": f.city || "",
  "State": f.state || "",
  "Preferred language": f.preferredLanguage || "",
  "Opened via": f.openMode || "",

  "Ease rating": f.easeRating || "",
  "Guidance": f.guidance || "",
  "Activation time": f.activationRating || "",
  "Documents feedback": f.documents || "",

  "Contact support": f.supportContacted || "",
  "Support satisfaction": f.supportRating || "",
  "Technical issues": f.technicalIssues || "",

  "Feature improvements": f.improvements || "",
  "Recommendation": f.recommend || "",
  "Overall rating": f.overallRating || "",

  "Consent contact": f.consent || "",
  "Contact method": f.contactMethod || "",
  "Contact time": f.bestTime || "",

  "Telecaller name": f.telecallerName || "",
  "Created at": f.createdAt.toISOString().split("T")[0],
  "Status": f.status,
}));
    // Build CSV (Excel-friendly) and send as attachment
    const keys = Object.keys(rows[0] || {});
    const escape = (val) => {
      if (val == null) return "";
      const s = String(val).replace(/"/g, '""');
      return `"${s}"`;
    };

    const header = keys.join(",") + "\n";
    const csvBody = rows.map((r) => keys.map((k) => escape(r[k])).join(",")).join("\n");
    const csv = "\uFEFF" + header + csvBody; // BOM for Excel

    const user = feedbacks[0].user;

const safeName = (user.fullName || "user")
  .replace(/[^a-zA-Z0-9 ]/g, "")   // remove special chars
  .trim()
  .replace(/\s+/g, "_");           // spaces → _

const today = new Date().toISOString().split("T")[0];

const fileName = `${safeName}_feedback_report_${today}.csv`;

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    return res.send(Buffer.from(csv, "utf8"));

  } catch (error) {
    console.error("Excel download error:", error);
    res.status(500).json({
      success: false,
      message: "Excel generation failed",
    });
  }
};




export const getAllDematsAdmin = async (req, res) => {
  const demats = await Demat.find().sort({ createdAt: -1 });
  res.json({ success: true, demats });
};
export const deleteDemat = async (req, res) => {
  const { id } = req.params;

  const demat = await Demat.findById(id);
  if (!demat) {
    return res.status(404).json({
      success: false,
      message: "Demat not found",
    });
  }

  await demat.deleteOne();

  res.json({
    success: true,
    message: "Demat deleted permanently",
  });
};




export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const admin = await User.findOne({ email, role: "ADMIN" })
      .select("+password");

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid admin credentials",
      });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid admin credentials",
      });
    }

    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
  httpOnly: true,
  secure: true,        // 🔥 Render HTTPS ke liye MUST
  sameSite: "none",    // 🔥 Cross-domain ke liye MUST
  maxAge: 24 * 60 * 60 * 1000,
});


    res.status(200).json({
      success: true,
      message: "Admin login successful",
      user: {
        id: admin._id,
        fullName: admin.fullName,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const logoutUser = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};


export const getFeedbackUsersSummary = async (req, res) => {
  try {
    const data = await Feedback.aggregate([
      {
        $group: {
          _id: "$user",
          total: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          _id: "$user._id",
          fullName: "$user.fullName",
          email: "$user.email",
          mobile: "$user.mobile", 
          total: 1,
        },
      },
      { $sort: { total: -1 } },
    ]);

    res.json({
      success: true,
      users: data,
    });
  } catch (err) {
    console.error("Feedback users summary error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch feedback users",
    });
  }
};

export const getPendingUsers = async (req, res) => {
  const users = await User.find({ isVerified: false, role: "USER" })
    .select("-password");

  res.json({ success: true, users });
};

// Verified users
export const getVerifiedUsers = async (req, res) => {
  const users = await User.find({ isVerified: true, role: "USER" })
    .select("-password");

  res.json({ success: true, users });
};

// Verify user
export const verifyUser = async (req, res) => {
  const { id } = req.params;

  const user = await User.findByIdAndUpdate(
    id,
    { isVerified: true },
    { new: true }
  );

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  res.json({ success: true, message: "User verified successfully" });
};

/* =========================
   🏦 DEMAT MANAGEMENT
========================= */

// Active demats (user dropdown)
export const getActiveDemats = async (req, res) => {
  const demats = await Demat.find({ isActive: true }).sort({ name: 1 });
  res.json({ success: true, demats });
};

// Add demat
export const addDemat = async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ success: false, message: "Demat name required" });
  }

  const exists = await Demat.findOne({ name });
  if (exists) {
    return res.status(409).json({ success: false, message: "Demat already exists" });
  }

  await Demat.create({ name });

  res.status(201).json({ success: true, message: "Demat added successfully" });
};

// Toggle active/inactive
export const toggleDematStatus = async (req, res) => {
  const { id } = req.params;

  const demat = await Demat.findById(id);
  if (!demat) {
    return res.status(404).json({ success: false, message: "Demat not found" });
  }

  demat.isActive = !demat.isActive;
  await demat.save();

  res.json({
    success: true,
    message: `Demat ${demat.isActive ? "activated" : "deactivated"}`,
  });
};

/* =========================
   📝 FEEDBACK MANAGEMENT
========================= */

export const getAllFeedbacks = async (req, res) => {
  const feedbacks = await Feedback.find()
    .populate("user", "fullName email")
    .populate("dematAccount", "name")
    .sort({ createdAt: -1 });

  res.json({ success: true, feedbacks });
};

// Delete demat (admin)

// Summary of feedbacks grouped by user (count + last feedback)
