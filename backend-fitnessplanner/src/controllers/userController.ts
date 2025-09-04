import { Request, Response, NextFunction } from "express";

export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // TODO: buscar perfil con req.user.id
    res.json({ id: req.user?.id, username: "demoUser" });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // TODO: actualizar objetivo, nivel, tiempo disponible
    res.json({ message: "Perfil actualizado" });
  } catch (error) {
    next(error);
  }
};
