import express from "express";
import {
  addUser,
  deleteUser,
  getUser,
  getUserById,
  updateUser,
} from "../controllers/userController";
import {
  validateAddUser,
  validateUpdateUser,
} from "../middleware/userValidation";
import { checkRole } from "../middleware/roleMiddleware";
import authMiddleware from "../middleware/authMiddleware";

const userRoute = express.Router();

userRoute.get("/", getUser);
userRoute.get("/:id", getUserById);
userRoute.post(
  "/",
  authMiddleware,
  checkRole(["admin"]),
  validateAddUser,
  addUser
);
userRoute.put(
  "/:id",
  authMiddleware,
  checkRole(["admin"]),
  validateUpdateUser,
  updateUser
);
userRoute.delete("/:id", authMiddleware, checkRole(["admin"]), deleteUser);

export default userRoute;
