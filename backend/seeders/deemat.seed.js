import Demat from "../models/demat.model.js";

const DEFAULT_DEMATS = [
  "ShareMarket",
  "Paytm Money",
  "HDFC Sky",
  "MStock",
  "Aditya Birla",
  "Lemonn",
  "Upstox",
  "Angelone",
];

export const seedDefaultDemats = async () => {
  try {
    for (const name of DEFAULT_DEMATS) {
      await Demat.updateOne(
        { name },                    // if exists → skip
        { $setOnInsert: { name } },  // insert only once
        { upsert: true }
      );
    }

    console.log("✅ Default Demat platforms ready");
  } catch (error) {
    console.error("❌ Demat seeding error:", error);
  }
};
