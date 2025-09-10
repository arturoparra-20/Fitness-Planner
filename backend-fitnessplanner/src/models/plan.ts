// models/plan.ts
import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db";
import User from "./user";

class Plan extends Model {
  public id!: number;
  public userId!: number;
  public mes!: string; // "2025-09"
}

Plan.init(
  {
    mes: DataTypes.STRING,
  },
  { sequelize, modelName: "plan" }
);

class Routine extends Model {
  public id!: number;
  public planId!: number;
  public semana!: number; // 1, 2, 3, 4
  public dia!: string; // Lunes, Martes, etc.
  public ejercicios!: string; // JSON string
}

Routine.init(
  {
    semana: DataTypes.INTEGER,
    dia: DataTypes.STRING,
    ejercicios: DataTypes.TEXT,
  },
  { sequelize, modelName: "routine" }
);

Plan.belongsTo(User, { foreignKey: "userId" });
User.hasMany(Plan, { foreignKey: "userId" });
Plan.hasMany(Routine, { foreignKey: "planId" });
Routine.belongsTo(Plan, { foreignKey: "planId" });

export { Plan, Routine };
