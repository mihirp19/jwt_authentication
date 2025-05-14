import express from "express";
import dotenv from "dotenv";
dotenv.config({ path: "../.env" });
import { sequelize } from "./config/db";
import userRoute from "./routes/userRoute";
import postRoute from "./routes/postRoute";
import authRoute from "./routes/authRoute";
import { errorHandler } from "./middleware/errorHandler";

const app = express();
const PORT = process.env.PORT;

app.use(express.json());

app.use("/auth", authRoute);
app.use("/users", userRoute);
app.use("/posts", postRoute);

app.use(errorHandler);

const start = async () => {
  try {
    await sequelize.authenticate();
    console.log("database connected");
    // await sequelize.sync();
    // console.log("database synced!");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("connection error", error);
  }
};
start();
