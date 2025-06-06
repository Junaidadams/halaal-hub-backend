import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "add_host",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const register = async (req, res) => {
  // const { email, password, role, username } = req.body;
  return res.status(200).json({ message: "Connected" });
};

export const login = async (req, res) => {
  // const { email, password, role, username } = req.body;
  return res.status(200).json({ message: "Connected" });
};

const sendVerificationEmail = (email, token) => {
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
