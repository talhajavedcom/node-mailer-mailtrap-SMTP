const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Email configuration
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_SECURE === "true",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Validate email format
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Email sending endpoint
app.post("/send-email", async (req, res) => {
  try {
    const { toEmail, subject, message } = req.body;

    // Input validation
    if (!toEmail || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    if (!isValidEmail(toEmail)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM || "noreply@yourdomain.com",
      to: toEmail,
      subject: subject,
      text: message,
    };

    // Send email using promises
    const info = await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: "Email sent successfully",
      messageId: info.messageId,
    });
  } catch (error) {
    console.error("Email sending error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send email",
      error: error.message,
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
    error:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Internal server error",
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
