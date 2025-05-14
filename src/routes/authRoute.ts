import { Router } from "express";
import {
  login,
  refreshTokenLogin,
  register,
} from "../controllers/authController";

const authRoute = Router();

authRoute.post("/register", register);
authRoute.post("/login", login);
authRoute.post("/refresh", refreshTokenLogin);

export default authRoute;
