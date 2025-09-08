import { DataTypes, Model } from "sequelize";
import type { Optional } from "sequelize";
import sequelize from "../config/db";
import User from "./user";

interface PlanAttributes {
  id: number;
  name: string;
  description?: string;
  userId: number;
}

interface PlanCreationAttributes extends Optional<PlanAttributes, "id"> {}

class Plan extends Model<PlanAttributes, PlanCreationAttributes>
  implements PlanAttributes {
  public id!: number;
  public name!: string;
  public description?: string;
  public userId!: number;
}

Plan.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: { type: DataTypes.STRING, allowNull: false },
    description: DataTypes.TEXT,
    userId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  },
  { sequelize, modelName: "Plan" }
);

// Relación: un User tiene muchos Planes
User.hasMany(Plan, { foreignKey: "userId" });
Plan.belongsTo(User, { foreignKey: "userId" });

export default Plan;