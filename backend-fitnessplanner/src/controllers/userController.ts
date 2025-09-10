import { Request, Response, NextFunction } from "express";
import User  from "../models/user";

export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // TODO: buscar perfil con req.user.id
    res.json({ id: req.user?.id, username: "demoUser" });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { objetivo, nivel, tiempoDisponible, altura, peso } = req.body;

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    await user.update({ objetivo, nivel, tiempoDisponible, altura, peso });

    return res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al actualizar perfil" });
  }
};
