import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS, // App Password
  },
});

export async function sendOtpMail(to: string, otp: string) {
  await transporter.sendMail({
    from: `"Fitness Planner" <${process.env.GMAIL_USER}>`,
    to,
    subject: "Tu código OTP",
    text: `Tu código de verificación es: ${otp}`,
    html: `<p>Tu código de verificación es: <b>${otp}</b></p>`,
  });
}
