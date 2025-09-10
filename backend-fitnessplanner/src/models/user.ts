import { DataTypes, Model } from "sequelize";
import type { Optional } from "sequelize";
import sequelize from "../config/db";

interface UserAttributes {
  id: number;
  nombre: string;
  email: string;
  password: string;
  objetivo?: string;
  nivel?: string;
  tiempoDisponible?: string;
  altura?: string;
  peso?: string;
}

interface UserCreationAttributes extends Optional<UserAttributes, "id"> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public nombre!: string;
  public email!: string;
  public password!: string;
  public objetivo?: string;
  public nivel?: string;
  public tiempoDisponible?: string;
  public altura?: string;
  public peso?: string;
}

User.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nombre: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    objetivo: { type: DataTypes.STRING },
    nivel: { type: DataTypes.STRING },
    tiempoDisponible: { type: DataTypes.STRING },
    altura: { type: DataTypes.STRING },
    peso: { type: DataTypes.STRING },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "Users",
  }
);

export default User;
