import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user";
import nodemailer from "nodemailer";
import { sendOtpMail } from "../services/mailService";
import {  verifyOtp } from "../utils/otpStore";
import { verifyGoogleToken } from "../services/googleAuthService";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

const pendingUsers: {
  [email: string]: {
    nombre: string;
    password: string;
    otp: string;
    expiresAt: number;
  };
} = {};

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const register = async (req: Request, res: Response) => {
  try {
    const { nombre, email, password } = req.body;

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: "El email ya está registrado" });
    }

    // Hash password pero todavía no guardamos en BD
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generar OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 60 * 60 * 1000; // 1 hora

    // Guardar en memoria temporal
    pendingUsers[email] = { nombre, password: hashedPassword, otp, expiresAt };

    // Enviar email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verificación de cuenta - OTP",
      text: `Tu código OTP es: ${otp}. Expira en 1 hora.`,
    });

      // Generar pendingToken con email para en verifyOtpController solo ingresar el otp por parte del frontend
    const pendingToken = jwt.sign(
      { email },
      process.env.JWT_SECRET as string,
      { expiresIn: "5m" } // válido solo 5 min
    );

    return res.status(200).json({ message: "OTP enviado a tu correo", pendingToken });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error en registro" });
  }
};

// 🔑 Paso 2: verificar OTP y crear usuario en BD
export const verifyOtpController = async (req: Request, res: Response) => {
  try {
    const { pendingToken, code } = req.body;

    //validar pendingToken
    const decoded = jwt.verify(pendingToken, process.env.JWT_SECRET as string) as { email: string };
    const email = decoded.email;

    const pending = pendingUsers[email];
    if (!pending) {
      return res.status(400).json({ message: "No hay registro pendiente para este correo" });
    }

    if (pending.expiresAt < Date.now()) {
      delete pendingUsers[email];
      return res.status(400).json({ message: "El OTP ha expirado" });
    }

    if (pending.otp !== code) {
      return res.status(400).json({ message: "OTP incorrecto" });
    }

    // Crear usuario en BD
    const newUser = await User.create({
      nombre: pending.nombre,
      email,
      password: pending.password,
    });

    // Eliminar de memoria temporal
    delete pendingUsers[email];

    // Crear JWT
    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET as string, {
      expiresIn: "1d",
    });

    return res.status(201).json({ token, user: newUser });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error al verificar OTP" });
  }
};

// 🔑 Login normal
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) return res.status(400).json({ message: "Usuario no encontrado" });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ message: "Contraseña incorrecta" });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, {
      expiresIn: "1d",
    });

    return res.json({ token, user });
  } catch (err) {
    return res.status(500).json({ message: "Error en login" });
  }
};

export const googleLogin = async (req: Request, res: Response) => {
  try {
    const { token } = req.body; // frontend manda ID token de Google
    const { email, name } = await verifyGoogleToken(token);

    let user = await User.findOne({ where: { email } });
    if (!user) {
      user = await User.create({ nombre: name, email, password: "" }); // sin password
    }

    const jwtToken = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1d" });
    res.json({ token: jwtToken });
  } catch (err) {
    res.status(401).json({ message: "Google login failed", error: err });
  }
};

