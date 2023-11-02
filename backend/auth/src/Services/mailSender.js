require("dotenv").config();
const nodeMailer = require("nodemailer");
const ErrorResponse = require("../Middlewares/errorHandler");

const mailSender = async (email, subject, message) => {
  try {
    const transporter = nodeMailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.ADMIN_EMAIL_HOST,
        pass: process.env.ADMIN_EMAIL_HOST_PASS,
      },
    });

    const mailOptions = {
      from: process.env.ADMIN_EMAIL_HOST,
      to: email,
      subject: subject,
      text: message,
    };

    let info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
    return info;
  } catch (error) {
    console.error(error);
    throw new ErrorResponse("Error sending email", 500);
  }
};

module.exports = mailSender;
