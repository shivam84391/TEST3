import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { seedDefaultDemats } from "../seeders/deemat.seed.js"
import { seedAdminUser } from '../seeders/admin.seed.js';

dotenv.config();

const mongoURI = process.env.MONGODB_URI;

if (!mongoURI) {
    throw new Error('MONGODB_URI environment variable not set');
}

// Export `db` at top-level; assign after connect.
let db;
try {
    // Use default options for current driver (avoid deprecated flags)
    await mongoose.connect(mongoURI);

    db = mongoose.connection;

    db.on("error", (err) => {
        console.error("MongoDB connection error:", err);
    });

    db.once("open", async () => {
        console.log("Connected to MongoDB");
        try {
            await seedDefaultDemats();
            await seedAdminUser();
        } catch (seedErr) {
            console.error("❌ Demat/admin seeding error:", seedErr);
        }
    });
} catch (connectErr) {
    console.error("Failed to connect to MongoDB:", connectErr);
    // rethrow so app startup fails visibly
    throw connectErr;
}

export default db;