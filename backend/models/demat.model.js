import mongoose from "mongoose";

const dematSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    isActive: {
      type: Boolean,
      default: true, // admin hide/show
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Demat", dematSchema);
