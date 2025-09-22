// server.js (or index.js)
import express from "express";
import cors from "cors";
import morgan from "morgan";
import compression from "compression";
import dotenv from "dotenv";

import connectDB from "./config/db.js";  
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import adminContentRoutes from "./routes/adminContent.routes.js";
import publicContentRoutes from "./routes/publicContent.routes.js";
import roadmapRoutes from "./routes/roadmap.routes.js";  

import commentRoutes from "./routes/comment.routes.js";
import likeRoutes from "./routes/like.routes.js";
import activityRoutes from "./routes/activity.routes.js";
import summaryRoutes from "./routes/summary.routes.js";

import paymentRoutes from "./routes/payment.routes.js";

import { requireAuth, requireUser, requireAdmin } from "./middleware/auth.middleware.js";

dotenv.config();
const app = express();

// Middlewares
app.use(cors());
app.use(compression());
app.use(morgan("dev"));
app.use(express.json({ limit: "2mb" }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", requireAuth, requireUser, userRoutes);
app.use("/api/admin", requireAuth, requireAdmin, adminRoutes); // secure admin route
app.use("/api/admin/contents", adminContentRoutes);
app.use("/api", publicContentRoutes);

app.use("/api/comments", commentRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/activity", activityRoutes);
app.use("/api/summary", summaryRoutes);

app.use("/api/roadmaps", roadmapRoutes);

app.use("/api/payment", paymentRoutes);

// Health Check
app.get("/health", (_, res) => res.json({ ok: true }));

// Connect DB first, then start server
const PORT = process.env.PORT || 4000;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
};

startServer();
