// Run: node scripts/seed.js
// Make sure to set MONGODB_URI in .env.local first

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config({ path: ".env.local" });

const UserSchema = new mongoose.Schema({
  name: String, email: String, password: String,
  role: String, phone: String, isActive: { type: Boolean, default: true },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model("User", UserSchema);

const DeptSchema = new mongoose.Schema({ name: String, description: String }, { timestamps: true });
const Department = mongoose.models.Department || mongoose.model("Department", DeptSchema);

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB");

  // Clear existing
  await User.deleteMany({});
  await Department.deleteMany({});

  // Departments
  const depts = await Department.insertMany([
    { name: "Cardiology", description: "Heart & cardiovascular care" },
    { name: "Neurology", description: "Brain & nervous system" },
    { name: "Orthopedics", description: "Bones, joints & muscles" },
    { name: "Pediatrics", description: "Child healthcare" },
    { name: "Emergency", description: "24/7 emergency services" },
  ]);
  console.log("✅ Departments created");

  // Users
  const hash = (p) => bcrypt.hash(p, 10);
  await User.insertMany([
    { name: "Super Admin", email: "admin@medicare.com", password: await hash("admin123"), role: "Admin", phone: "+91-9000000001" },
    { name: "Rahul Patient", email: "patient@medicare.com", password: await hash("patient123"), role: "Patient", phone: "+91-9000000004" },
    { name: "Sunita Reception", email: "reception@medicare.com", password: await hash("reception123"), role: "Reception", phone: "+91-9000000005" },
    { name: "Pharmacy Staff", email: "pharmacy@medicare.com", password: await hash("pharmacy123"), role: "Pharmacy", phone: "+91-9000000006" },
    { name: "Lab Technician", email: "lab@medicare.com", password: await hash("lab123"), role: "Lab", phone: "+91-9000000007" },
  ]);
  console.log("✅ Users created");
  console.log("\n🎉 Seed complete! Login credentials:");
  console.log("Admin:     admin@medicare.com / admin123");
  console.log("Patient:   patient@medicare.com / patient123");
  console.log("Reception: reception@medicare.com / reception123");
  console.log("Pharmacy:  pharmacy@medicare.com / pharmacy123");
  console.log("Lab:       lab@medicare.com / lab123");

  await mongoose.disconnect();
}

seed().catch(console.error);
