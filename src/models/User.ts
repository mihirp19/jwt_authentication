import { Optional, Model, DataTypes } from "sequelize";
import { sequelize } from "../config/db";

export interface UserAttribs {
  id: number;
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";
}

export interface UserCreation extends Optional<UserAttribs, "id"> {}
class User extends Model<UserAttribs, UserCreation> implements UserAttribs {
  declare id: number;
  declare name: string;
  declare email: string;
  declare password: string;
  declare role: "user" | "admin";
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("user", "admin"),
      allowNull: false,
      defaultValue: "user",
    },
  },
  {
    sequelize,
    tableName: "users",
    modelName: "User",
  }
);

export default User;
