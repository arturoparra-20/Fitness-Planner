// Event controller
import { Request, Response, NextFunction } from "express";

export const createEvent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(201).json({ message: "Evento creado" });
  } catch (error) {
    next(error);
  }
};

export const listEvents = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json([{ id: 1, title: "Evento demo" }]);
  } catch (error) {
    next(error);
  }
};

export const updateEvent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json({ message: `Evento ${req.params.id} actualizado` });
  } catch (error) {
    next(error);
  }
};

export const deleteEvent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json({ message: `Evento ${req.params.id} eliminado` });
  } catch (error) {
    next(error);
  }
};
