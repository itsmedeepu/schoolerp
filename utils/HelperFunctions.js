const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const genrateUniqueId = () => {
  return uuidv4();
};

const genrateToken = (payload, to) => {
  if (to === "teacher") {
    const token = jwt.sign(
      JSON.stringify(payload),
      process.env.TEACHER_PRIVATE_KEY
    );
    return token;
  }
  if (to === "student") {
    const token = jwt.sign(
      JSON.stringify(payload),
      process.env.STUDENT_PRIVATE_KEY
    );
    return token;
  }

  const token = jwt.sign(JSON.stringify(payload), process.env.DEFAULT_KEY);

  return token;
};

const isValidText = (data) => {
  if (data && data.trim() !== "") {
    return true;
  }
  return false;
};

const sendEmail = (data) => {
  const nodemailer = require("nodemailer"); // Ensure Nodemailer is required

  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE, // e.g., 'gmail'
    host: process.env.EMAIL_HOST, // e.g., 'smtp.gmail.com'
    port: 465,
    secure: true, // Use SSL
    auth: {
      user: process.env.SENDER_GMAIL_ID, // Your email ID
      pass: process.env.SENDER_GMAIL_PASSWORD, // Your email password or app password
    },
  });

  const url = process.env.FRONTEND_URL; // Use 'process.env' instead of 'process.'

  // Email options
  const mailOptions = {
    from: process.env.SENDER_GMAIL_ID, // Sender address
    to: data.senderEmail, // Recipient's email address
    subject: "PASSWORD RESET LINK", // Email subject
    text: `Reset your password here: ${url}${data.token}`, // Plain text body
    html: `
      <b>Hello from Node.js!</b>
      <p>Reset your password here: <a href="${url}${data.token}">${url}${data.token}</a></p>
    `, // HTML body
  };

  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return;
    }
    console.log(`Message Sent: ${info.response}`);
  });
};

module.exports = { genrateUniqueId, genrateToken, sendEmail, isValidText };
