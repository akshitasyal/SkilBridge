import bcrypt from "bcryptjs";
import prisma from "./config/db.js";

async function setupAdmin() {
  try {
    const adminEmail = "akshitasyal09@gmail.com"; // User's email from earlier
    const newPassword = "adminpassword123";
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Upsert will create the admin if they don't exist, or update them if they do
    const admin = await prisma.user.upsert({
      where: { email: adminEmail },
      update: {
        password: hashedPassword,
        role: "admin", // Ensure role is set correctly just in case they signed up as a normal user
      },
      create: {
        username: "Admin",
        email: adminEmail,
        password: hashedPassword,
        role: "admin",
        isSeller: false,
      },
    });

    console.log(`✅ Admin account ensured for: ${admin.email}`);
    console.log(`🔑 Your admin password is: ${newPassword}`);
  } catch (error) {
    console.error("❌ Error setting up admin:", error);
  } finally {
    await prisma.$disconnect();
  }
}

setupAdmin();
