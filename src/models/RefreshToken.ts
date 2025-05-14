import { DataTypes, Optional, Model } from "sequelize";
import { sequelize } from "../config/db";
import User from "./User";

export interface RefreshTokenAttribs {
  id: number;
  token: string;
  userId: number;
}

export interface RefTokenCreation extends Optional<RefreshTokenAttribs, "id"> {}

export class RefreshToken
  extends Model<RefreshTokenAttribs, RefTokenCreation>
  implements RefreshTokenAttribs
{
  declare id: number;
  declare token: string;
  declare userId: number;
}

RefreshToken.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "CASCADE",
    },
  },
  {
    sequelize,
    tableName: "reftokens",
    modelName: "RefreshToken",
  }
);

RefreshToken.belongsTo(User, { foreignKey: "userId" });
