import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    // 🔐 User
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ================= BASIC =================
    leadId: String,

    feedbackType: String,
    dematAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Demat",
      default: null,
    },

    feedbackTone: String,
    urgencyLevel: String,

    // ================= CUSTOMER =================
    customerName: String,
    contactNumber: String,
    gender: String,
    customerId: String,
    email: String,

    accountOpeningDate: Date,
    city: String,
    state: String,
    preferredLanguage: String,

    // ================= ACCOUNT EXPERIENCE =================
    openMode: String,
    easeRating: Number,
    guidance: String,
    activationRating: Number,
    documents: String,

    // ================= SUPPORT =================
    supportContacted: String,
    supportRating: Number,
    technicalIssues: String,

    // ================= FEEDBACK =================
    improvements: String,
    recommend: String,
    overallRating: Number,

    // ================= CONSENT =================
    consent: String,
    contactMethod: String,
    bestTime: String,

    // ================= TELECALLER =================
    telecallerName: String,

    // ================= ADMIN =================
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Feedback", feedbackSchema);
