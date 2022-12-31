const { User, Mailer } = require("../../../models");
const bcrypt = require("bcrypt");
const Validator = require("fastest-validator");
const v = new Validator();
const nodemailer = require("../../../config/mailer.config");
const jwt = require("jsonwebtoken");
const { JWT_SECRET, JWT_EXPIRED } = process.env;

module.exports = async (req, res) => {
  try {
    const schema = {
      email: "email|empty:false",
      password: "string|empty:false|min:5",
    };

    const validate = v.validate(req.body, schema);
    if (validate.lengh) {
      return res.status(400).json({
        status: "error",
        message: validate,
      });
    }

    const user = await User.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (user) {
      return res.status(409).json({
        status: "error",
        message: "email already exist",
      });
    }

    const token = jwt.sign({ email: req.body.email }, JWT_SECRET, {
      expiresIn: JWT_EXPIRED,
    });

    const password = await bcrypt.hash(req.body.password, 10);

    const data = {
      email: req.body.email,
      password,
      token,
    };

    nodemailer.sendConfirmationEmail(req.body.email, token);

    const createdUser = await User.create(data);
    await Mailer.create({
      email: req.body.email,
      pin: token,
      status: "pending",
    });

    return res.json({
      status: "success",
      message: "Signup success, Please verify your email!",
      data: {
        id: createdUser.id,
      },
    });
  } catch (error) {
    return res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};
