require("dotenv").config();
const nodeMailer = require("nodemailer");
const ErrorResponse = require("../Middlewares/errorHandler");

const mailSender = (email, subject, message) => {

  try {
    let transporter = nodeMailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.ADMIN_EMAIL_HOST,
        pass: process.env.ADMIN_EMAIL_HOST_PASS,
      },
    });

    let mailOptions = {
      from: process.env.ADMIN_EMAIL_HOST,
      to: email,
      subject: subject,
      text: message,
    };

    console.log("mailOptions", mailOptions);

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
  } catch (err) {
    console.log(err);
  }
};

module.exports = mailSender;
