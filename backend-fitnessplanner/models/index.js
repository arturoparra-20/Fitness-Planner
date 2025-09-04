import { Sequelize } from "sequelize";
import dotenv from "dotenv";

import UserFactory from "./user";
import EventFactory from "./event";
import PlanFactory from "./plan";

dotenv.config();

// 🔹 Inicializar Sequelize
const sequelize = new Sequelize(
  process.env.DB_NAME || "mydb",
  process.env.DB_USER || "postgres",
  process.env.DB_PASS || "",
  {
    host: process.env.DB_HOST || "127.0.0.1",
    port: Number(process.env.DB_PORT) || 5432,
    dialect: "postgres",
    logging: false,
  }
);

// 🔹 Inicializar modelos
const User = UserFactory(sequelize);
const Event = EventFactory(sequelize);
const Plan = PlanFactory(sequelize);

// 🔹 Definir asociaciones
User.hasMany(Event, { foreignKey: "userId", as: "events" });
Event.belongsTo(User, { foreignKey: "userId", as: "user" });

User.hasMany(Plan, { foreignKey: "userId", as: "plans" });
Plan.belongsTo(User, { foreignKey: "userId", as: "user" });

export { sequelize, User, Event, Plan };
