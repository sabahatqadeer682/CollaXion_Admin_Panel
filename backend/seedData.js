// backend/seedData.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import CoCurricularEvent from "./models/CoCurricularEvent.js";
import CoCurricularTask from "./models/CoCurricularTask.js";
import CoCurricularNotification from "./models/CoCurricularNotification.js";
import CoCurricularInvitation from "./models/CoCurricularInvitation.js";

// Load environment variables
dotenv.config();

const seedDatabase = async () => {
    console.log("🌱 Starting database seeding...");
    
    try {
        // Connect to MongoDB
        console.log("📡 Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Connected to MongoDB");

        // Clear existing data
        console.log("🗑️  Clearing existing data...");
        await CoCurricularEvent.deleteMany({});
        await CoCurricularTask.deleteMany({});
        await CoCurricularNotification.deleteMany({});
        await CoCurricularInvitation.deleteMany({});
        console.log("✅ Existing data cleared");

        // ========== CREATE EVENTS ==========
        console.log("📅 Creating events...");
        const events = await CoCurricularEvent.insertMany([
            {
                name: "AI & Robotics Workshop",
                date: "2024-11-15",
                venue: "CS Lab, Block B",
                expected: 80,
                registered: 72,
                category: "Technical",
                coordinator: "Dr. N. Sharma",
                coordinatorEmail: "n.sharma@collxion.edu",
                budget: 15000,
                description: "Hands-on workshop on AI and robotics with industry experts",
                poster: null,
                status: "upcoming"
            },
            {
                name: "Annual Sports Day 2024",
                date: "2024-11-22",
                venue: "Main Ground",
                expected: 500,
                registered: 480,
                category: "Sports",
                coordinator: "Prof. P. Singh",
                coordinatorEmail: "p.singh@collxion.edu",
                budget: 45000,
                description: "Inter-department sports competition",
                poster: null,
                status: "upcoming"
            },
            {
                name: "Cultural Night 2024",
                date: "2024-12-01",
                venue: "Open Air Theatre",
                expected: 800,
                registered: 720,
                category: "Cultural",
                coordinator: "Ms. R. Gupta",
                coordinatorEmail: "r.gupta@collxion.edu",
                budget: 75000,
                description: "Annual cultural extravaganza",
                poster: null,
                status: "upcoming"
            }
        ]);
        console.log(`✅ Created ${events.length} events`);

        // ========== CREATE TASKS ==========
        console.log("📋 Creating tasks...");
        const tasks = await CoCurricularTask.insertMany([
            {
                title: "Finalize Tech Summit Schedule",
                assignedTo: "Prof. R. Mehta",
                assignedToEmail: "r.mehta@collxion.edu",
                deadline: "2024-11-12",
                status: "In Progress",
                progress: 75,
                description: "Coordinate with all speakers"
            },
            {
                title: "Sports Team Registration",
                assignedTo: "Prof. A. Khan",
                assignedToEmail: "a.khan@collxion.edu",
                deadline: "2024-11-20",
                status: "Pending",
                progress: 30,
                description: "Complete registration for sports teams"
            },
            {
                title: "Cultural Event Budget Approval",
                assignedTo: "Prof. S. Ahmed",
                assignedToEmail: "s.ahmed@collxion.edu",
                deadline: "2024-11-10",
                status: "Overdue",
                progress: 0,
                description: "Get budget approval for Cultural Night"
            }
        ]);
        console.log(`✅ Created ${tasks.length} tasks`);

        // ========== CREATE NOTIFICATIONS ==========
        console.log("🔔 Creating notifications...");
        const notifications = await CoCurricularNotification.insertMany([
            {
                title: "Budget Approval Pending",
                message: "Budget approval pending for Cultural Night - ₹75,000",
                type: "urgent",
                seen: false
            },
            {
                title: "Venue Booking Confirmed",
                message: "Venue confirmed for AI Workshop at CS Lab",
                type: "info",
                seen: false
            },
            {
                title: "Event Registration Update",
                message: "Cultural Night at 90% capacity",
                type: "success",
                seen: false
            }
        ]);
        console.log(`✅ Created ${notifications.length} notifications`);

        // ========== CREATE INVITATIONS ==========
        console.log("✉️  Creating invitations...");
        const invitations = await CoCurricularInvitation.insertMany([
            {
                eventId: events[0]._id,
                recipientName: "ABC Industries",
                recipientEmail: "contact@abcind.com",
                recipientType: "Industry",
                message: "Invitation to AI & Robotics Workshop",
                status: "Sent",
                sentAt: new Date()
            },
            {
                eventId: events[0]._id,
                recipientName: "TechNova Solutions",
                recipientEmail: "events@technova.com",
                recipientType: "Industry",
                message: "Join us for AI & Robotics Workshop",
                status: "Sent",
                sentAt: new Date()
            }
        ]);
        console.log(`✅ Created ${invitations.length} invitations`);

        // ========== SUMMARY ==========
        console.log("\n" + "=".repeat(50));
        console.log("🎉 DATABASE SEEDING COMPLETED SUCCESSFULLY!");
        console.log("=".repeat(50));
        console.log("📊 SUMMARY:");
        console.log(`   📅 Events: ${events.length}`);
        console.log(`   📋 Tasks: ${tasks.length}`);
        console.log(`   🔔 Notifications: ${notifications.length}`);
        console.log(`   ✉️  Invitations: ${invitations.length}`);
        console.log("=".repeat(50));
        console.log("🔐 LOGIN WITH:");
        console.log("   Username: cocu");
        console.log("   Password: cocu123");
        console.log("=".repeat(50));

    } catch (error) {
        console.error("❌ Error seeding database:", error);
    } finally {
        await mongoose.disconnect();
        console.log("👋 Disconnected from MongoDB");
        process.exit(0);
    }
};

seedDatabase();