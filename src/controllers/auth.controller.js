import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import axios from "axios";
import prisma from "../../lib/prisma.js";

import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const register = async (req, res) => {
  const { email, password, role, username } = req.body;

  const normalizedEmail = email.toLowerCase();

  try {
    const existingEmail = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already in use." });
    }

    const existingUsername = await prisma.user.findUnique({
      where: { username: username },
    });

    if (existingUsername) {
      return res.status(400).json({ message: "Username already in use." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const verificationToken = jwt.sign(
      { email: normalizedEmail },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );

    const newUser = await prisma.user.create({
      data: {
        email: normalizedEmail,
        password: hashedPassword,
        role: role,
        username,
      },
    });

    console.log(normalizedEmail + " " + hashedPassword);
    await sendVerificationEmail(normalizedEmail, verificationToken);

    return res.status(201).json({
      message: `Created successfully - ${normalizedEmail}, ${hashedPassword}, ${role}, ${username}`,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to create user." });
  }
};

export const verifyEmail = async (req, res) => {
  const { token } = req.query;

  try {
    const { email } = jwt.verify(token, process.env.JWT_SECRET_KEY);

    await prisma.user.update({
      where: { email },
      data: { verified: true },
    });

    res
      .status(200)
      .json({ message: "Email verified successfully. You can now log in." });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Invalid or expired token." });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const normalizedEmail = email.toLowerCase();
  try {
    const user = await prisma.user.findFirst({
      where: {
        email: {
          equals: normalizedEmail,
        },
      },
      include: {
        savedListings: true,
      },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid Credentials" });
    } else if (!user.verified) {
      return res.status(403).json({
        message: "Your account needs to be verified before you can log in.",
      });
    }

    const token = jwt.sign(
      { id: user.id, isAdmin: false },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );

    const { password: userPassword, ...userInfo } = user;

    // Send token as a separate property, and user data (including savedListings) as userData
    console.log(userInfo);
    res.status(200).json({ token, ...userInfo });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to log in" });
  }
};

export const logout = (req, res) => {
  console.log("Reached backend, clearing token...");
  res.clearCookie("token").status(200).json({ message: "Logout successful" });
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

export const addSaved = async (req, res) => {
  const { listingId, userId } = req.body;

  try {
    const existing = await prisma.savedListing.findFirst({
      where: { userId, listingId },
    });

    if (existing) {
      return res
        .status(409)
        .json({ message: "This listing is already saved." });
    }

    const savedListing = await prisma.savedListing.create({
      data: {
        listingId,
        userId,
      },
    });

    return res.status(200).json({
      message: "Listing saved successfully",
      savedListing,
    });
  } catch (error) {
    console.error("Error saving listing:", error);
    return res.status(500).json({ message: "Failed to save listing." });
  }
};

export const removeSaved = async (req, res) => {
  const { listingId, userId } = req.body;

  try {
    await prisma.savedListing.deleteMany({
      where: {
        userId,
        listingId,
      },
    });
    return res.status(200).json({ message: "Listing removed successfully" });
  } catch (error) {
    console.error("Error removing saved listing:", error);
    return res.status(500).json({ message: "Failed to remove listing." });
  }
};
