// Auth controller
import { Request, Response, NextFunction } from "express";

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // TODO: crear usuario en BD
    res.status(201).json({ message: "Usuario registrado" });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // TODO: verificar credenciales y devolver JWT
    res.json({ token: "fake-jwt-token" });
  } catch (error) {
    next(error);
  }
};
