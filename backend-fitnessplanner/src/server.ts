import dotenv from "dotenv";
import app from "./app";
import sequelize from "./config/db";

dotenv.config();

const PORT = process.env.PORT || 4000;

// Probar conexión a la base de datos y levantar servidor
(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Conexión a la base de datos exitosa");

    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Error al conectar a la base de datos:", error);
    process.exit(1);
  }
})();
