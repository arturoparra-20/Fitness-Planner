import { DataTypes, Model} from "sequelize";
import type { Optional } from "sequelize";
import sequelize from "../config/db";
import User from "./User";

interface EventAttributes {
  id: number;
  userId: number;
  titulo: string;
  descripcion?: string;
  fechaInicio: Date;
  fechaFin: Date;
  tipo: string;
}

interface EventCreationAttributes extends Optional<EventAttributes, "id"> {}

class Event extends Model<EventAttributes, EventCreationAttributes> implements EventAttributes {
  public id!: number;
  public userId!: number;
  public titulo!: string;
  public descripcion?: string;
  public fechaInicio!: Date;
  public fechaFin!: Date;
  public tipo!: string;
}

Event.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    titulo: { type: DataTypes.STRING, allowNull: false },
    descripcion: { type: DataTypes.TEXT },
    fechaInicio: { type: DataTypes.DATE, allowNull: false },
    fechaFin: { type: DataTypes.DATE, allowNull: false },
    tipo: { type: DataTypes.STRING, allowNull: false },
  },
  {
    sequelize,
    modelName: "Event",
    tableName: "Events",
  }
);

User.hasMany(Event, { foreignKey: "userId" });
Event.belongsTo(User, { foreignKey: "userId" });

export default Event;
