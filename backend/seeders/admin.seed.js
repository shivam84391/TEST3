import User from "../models/user.models.js";

export const seedAdminUser = async () => {
  try {
    const adminExists = await User.findOne({ role: "ADMIN" });

    if (!adminExists) {
      await User.create({
        fullName: "Super Admin",
        email: "admin@company.com",
        mobile: "9999999999",
        password: "Admin@123", // 🔐 auto-hashed by schema
        role: "ADMIN",
        isVerified: true,
        isActive: true,
      });

      console.log("✅ Super Admin created");
    } else {
      console.log("ℹ️ Super Admin already exists");
    }
  } catch (error) {
    console.error("❌ Admin seed error:", error);
  }
};
