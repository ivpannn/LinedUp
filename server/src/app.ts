import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes";
import prisma from "./utils/prisma"
import queueRoutes from "./routes/queue.routers"

const app = express();

app.use(cors());
app.use(express.json());

// all auth routers start with "/..."
// router.post("/register") -> /auth/register
app.use("/auth", authRoutes);
app.use("/queue", queueRoutes);

app.get("/", (req, res) => {
  res.send("QueueSnap API Running");
});

app.get("/test" ,async (req, res) => {
    const users = await prisma.user.findMany();
    res.send(users)
})

app.listen(5000, () => {
  console.log("Server running on port 5000");
});