import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import axios from "axios";

import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: "mail.roob.online",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const register = async (req, res) => {
  const { email, password, role, username } = req.body;

  const normalizedEmail = email.toLowerCase();
  const hashedPassword = await bcrypt.hash(password, 10);

  const verificationToken = jwt.sign(
    { email: normalizedEmail },
    process.env.JWT_SECRET_KEY,

    { expiresIn: "1h" }
  );

  await sendVerificationEmail(normalizedEmail, verificationToken);

  // return res.status(200).json({
  //   message: `Connected - ${email}, ${password}, ${role}, ${username}`,
  // });
};

export const login = async (req, res) => {
  // const { email, password, role, username } = req.body;
  return res.status(200).json({ message: "Connected" });
};

const sendVerificationEmail = (email, token) => {
  console.log(process.env.CLIENT_URL);
  const verificationUrl = `${process.env.CLIENT_URL}/verifying-email?token=${token}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Email verification - Halaal Hub",
    text: `Click the following link to verify your email:
    ${verificationUrl}`,
  };
  return transporter.sendMail(mailOptions);
};
