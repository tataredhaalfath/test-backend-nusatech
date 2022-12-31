const { User, Mailer } = require("../../../models");
const Validator = require("fastest-validator");
const v = new Validator();
const nodemailer = require("../../../config/mailer.config");
const jwt = require("jsonwebtoken");
const { JWT_SECRET, JWT_EXPIRED } = process.env;

module.exports = async (req, res) => {
  try {
    const schema = {
      email: "email|empty:false",
    };

    const validate = v.validate(req.body, schema);
    if (validate.length) {
      return res.status(400).json({
        status: "error",
        message: validate,
      });
    }

    const userId = req.user.id;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found!",
      });
    }

    if (user.status != "verified") {
      return res.status(400).json({
        status: "error",
        message: "Pending Account, Please Verify Your Email",
      });
    }

    const email = req.body.email;
    const checkEmail = await User.findOne({ where: { email: req.body.email } });

    if (checkEmail && email !== user.email) {
      return res.status(409).json({
        status: "error",
        message: "Email already exist",
      });
    }

    const token = jwt.sign({ email: req.body.email }, JWT_SECRET, {
      expiresIn: JWT_EXPIRED,
    });

    nodemailer.sendConfirmationEmail(req.body.email, token);

    const mailer = await Mailer.findOne({ where: { email: user.email } });
    await user.update({
      email,
      status: "pending",
    });

    await mailer.update({
      email,
      status: "pending",
      pin: token,
    });

    return res.json({
      status: "success",
      data: {
        id: user.id,
        email: user.email,
        status: user.status,
      },
      message: "Update Success, Please verify your email!",
    });
  } catch (error) {
    return res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};
