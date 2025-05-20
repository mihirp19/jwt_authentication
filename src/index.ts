import express from "express";
import dotenv from "dotenv";
dotenv.config({ path: "../.env" });
import { sequelize } from "./config/db";
import userRoute from "./routes/userRoute";
import postRoute from "./routes/postRoute";
import authRoute from "./routes/authRoute";
import { errorHandler } from "./middleware/errorHandler";
import rateLimit from "express-rate-limit";
import User from "./models/User";

const app = express();

const authLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 30,
  message: "Too many requests",
  standardHeaders: true,
  legacyHeaders: false,
});

const PORT = process.env.PORT;

app.use(express.json());

app.use("/auth", authLimiter, authRoute);
app.use("/users", userRoute);
app.use("/posts", postRoute);

app.use(errorHandler);
declare global {
  namespace Express {
    interface Request {
      user?: User; // Adjust type based on your user model/interface
    }
  }
}

const start = async () => {
  try {
    await sequelize.authenticate();
    console.log("database connected");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("connection error", error);
  }
};
start();
