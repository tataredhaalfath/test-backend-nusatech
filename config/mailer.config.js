// require("dotenv").config();
const nodemailer = require("nodemailer");
const { MAIL_USER, MAIL_PASS, PORT, HOST } = process.env;

const transport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: MAIL_USER,
    pass: MAIL_PASS,
  },
});

module.exports.sendConfirmationEmail = (email, confirmationCode) => {
  console.log("Check");
  transport
    .sendMail({
      from: MAIL_USER,
      to: email,
      subject: "Please confirm your account",
      html: `<h1>Email Confirmation</h1>
        <p>Thank you for subscribing. Please confirm your email by clicking on the following link</p>
        <a href=http://${HOST}:${PORT}/users/confirm/${confirmationCode}> Click here</a>
        </div>`,
    })
    .catch((err) => console.log(err));
};
