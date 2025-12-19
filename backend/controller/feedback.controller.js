import mongoose from "mongoose";
import Feedback from "../models/feedback.model.js";
import Demat from "../models/demat.model.js";

export const submitFeedback = async (req, res) => {
  try {
    const userId = req.user.id;

    const feedback = await Feedback.create({
      user: userId,

      leadId: req.body.leadId,
      feedbackType: req.body.feedbackType,
      dematAccount: req.body.dematAccount || null,

      feedbackTone: req.body.feedbackTone,
      urgencyLevel: req.body.urgencyLevel,

      customerName: req.body.customerName,
      contactNumber: req.body.contactNumber,
      gender: req.body.gender,
      customerId: req.body.customerId,
      email: req.body.email,

      accountOpeningDate: req.body.accountOpeningDate,
      city: req.body.city,
      state: req.body.state,
      preferredLanguage: req.body.language,

      openMode: req.body.openMode,
      easeRating: req.body.easeRating,
      guidance: req.body.guidance,
      activationRating: req.body.activationRating,
      documents: req.body.documents,

      supportContacted: req.body.supportContacted,
      supportRating: req.body.supportRating,
      technicalIssues: req.body.technicalIssues,

      improvements: req.body.improvements,
      recommend: req.body.recommend,
      overallRating: req.body.overallRating,

      consent: req.body.consent,
      contactMethod: req.body.contactMethod,
      bestTime: req.body.bestTime,

      telecallerName: req.body.telecallerName,
    });

    res.status(201).json({
      success: true,
      message: "Feedback submitted successfully",
      feedbackId: feedback._id,
    });
  } catch (err) {
    console.error("Submit feedback error:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Return all feedbacks submitted by the authenticated user
export const getUserFeedbacks = async (req, res) => {
  try {
    const userId = req.user.id;

    const feedbacks = await Feedback.find({ user: userId })
      .populate("dematAccount", "name")
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, data: feedbacks });
  } catch (error) {
    console.error("Get user feedbacks error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
