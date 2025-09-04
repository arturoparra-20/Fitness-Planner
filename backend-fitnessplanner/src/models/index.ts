import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME as string,
  process.env.DB_USER as string,
  process.env.DB_PASS as string,
  {
    host: process.env.DB_HOST || "",
    dialect: "postgres",
    logging: false,
  }
);
// Importar modelos
import User from "./User";
import Plan from "./Plan";
import Event from "./Event";

// Ejecutar asociaciones
User.hasMany(Plan, { foreignKey: "userId" });
Plan.belongsTo(User, { foreignKey: "userId" });

Plan.hasMany(Event, { foreignKey: "planId" });
Event.belongsTo(Plan, { foreignKey: "planId" });

export { sequelize, User, Plan, Event };

export default sequelize;
