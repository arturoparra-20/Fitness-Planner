// controllers/planController.ts
import { Request, Response } from "express";
import { Plan, Routine } from "../models/plan";
import User from "../models/user";
import { aiService } from "../services/aiService";
import dayjs from "dayjs";

export const generatePlan = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const user = await User.findByPk(userId);

    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    if (!user.tiempoDisponible || !user.objetivo || !user.nivel) {
      return res.status(400).json({ message: "Completa tu perfil antes de generar un plan" });
    }

    // verificar si ya tiene plan para este mes
    const mes = dayjs().format("YYYY-MM");
    const existing = await Plan.findOne({ where: { userId, mes } });
    if (existing) {
      return res.status(400).json({ message: "Ya tienes un plan generado este mes" });
    }

    // prompt con progresión
    const prompt = `
Eres un entrenador personal. Crea un plan mensual (4 semanas) con progresión en cargas o volumen.
Datos del usuario:
- Objetivo: ${user.objetivo}
- Nivel: ${user.nivel}
- Días disponibles por semana: ${user.tiempoDisponible}
- Altura: ${user.altura} cm
- Peso: ${user.peso} kg

El plan debe tener ${user.tiempoDisponible} rutinas por semana, cada una con lista de ejercicios,
series y repeticiones, aumentando la dificultad semana a semana.

Devuelve en formato JSON:
[
  { "semana": 1, "dia": "Lunes", "ejercicios": ["Sentadillas 4x12", "Flexiones 3x15"] },
  { "semana": 1, "dia": "Miércoles", "ejercicios": ["Peso muerto 4x10", "Plancha 3x1min"] },
  ...
]
    `;

    const aiResponse = await aiService(prompt);
    const rutinas = JSON.parse(aiResponse);

    // Guardar en la BD
    const plan = await Plan.create({ userId, mes });

    for (const rutina of rutinas) {
      await Routine.create({
        planId: plan.id,
        semana: rutina.semana,
        dia: rutina.dia,
        ejercicios: JSON.stringify(rutina.ejercicios),
      });
    }

    const planConRutinas = await Plan.findByPk(plan.id, { include: [Routine] });

    res.json(planConRutinas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al generar plan" });
  }
};
export const getCurrentPlan = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const mes = dayjs().format("YYYY-MM");

    const plan = await Plan.findOne({
      where: { userId, mes },
      include: [Routine],
    });

    if (!plan) return res.status(404).json({ message: "No tienes plan este mes" });

    res.json(plan);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener plan" });
  }
};
