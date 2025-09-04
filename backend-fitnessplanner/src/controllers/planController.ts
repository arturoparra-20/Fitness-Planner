import { Request, Response, NextFunction } from "express";

export const generatePlan = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // TODO: mock de generación de plan con inputs
    res.status(201).json({ id: 1, name: "Plan demo generado" });
  } catch (error) {
    next(error);
  }
};

export const listPlans = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // TODO: obtener planes de BD por usuario
    res.json([{ id: 1, name: "Plan 1" }]);
  } catch (error) {
    next(error);
  }
};

export const getPlanById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json({ id: req.params.id, name: "Plan detalle" });
  } catch (error) {
    next(error);
  }
};

export const deletePlan = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json({ message: `Plan ${req.params.id} eliminado` });
  } catch (error) {
    next(error);
  }
};
