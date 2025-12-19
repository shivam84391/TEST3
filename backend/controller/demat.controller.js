import Demat from "../models/demat.model.js";

/**
 * @desc    Get all active Demat platforms
 * @route   GET /api/demats
 * @access  Public (User side)
 */
export const getAllDemats = async (req, res) => {
  try {
    const demats = await Demat.find({ isActive: true })
      .select("name")          // sirf name bhejo
      .sort({ name: 1 });      // alphabetical order

    return res.status(200).json({
      success: true,
      count: demats.length,
      data: demats,
    });
  } catch (error) {
    console.error("Get Demats Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch demat platforms",
    });
  }
};