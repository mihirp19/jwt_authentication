import { sequelize } from "../config/db";
import { DataTypes, Optional, Model } from "sequelize";
import User from "./User";

export interface PostAttribs {
  id: number;
  title: string;
  description: string;
  userId: number;
}

export interface PostCreation extends Optional<PostAttribs, "id"> {}

class Post extends Model<PostAttribs, PostCreation> implements PostAttribs {
  declare id: number;
  declare title: string;
  declare description: string;
  declare userId: number;
}

Post.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
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
    tableName: "posts",
    modelName: "Post",
  }
);

User.hasMany(Post, { foreignKey: "userId" });
Post.belongsTo(User, { foreignKey: "userId" });

export default Post;
