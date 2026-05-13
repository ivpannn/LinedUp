import cors from "cors";
import "dotenv/config";
import express from "express";

import authRoutes from "./routes/auth.routes";
import queueRoutes from "./routes/queue.routers";
import prisma from "./utils/prisma";

const app = express();

app.use(cors());
app.use(express.json());

// all auth routers start with "/..."
// router.post("/register") -> /auth/register
// router.post("/joinQueue") -> /queue/joinQueue
app.use("/auth", authRoutes);
app.use("/queue", queueRoutes);

app.get("/", (req, res) => {
  res.send("QueueSnap API Running");
});

app.get("/test", async (req, res) => {
  const users = await prisma.user.findMany();
  res.send(users)
})

app.listen(5000, "0.0.0.0", () => {
  console.log("Server running on port 5000");
});