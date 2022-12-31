const bcrypt = require("bcrypt");
const { User } = require("../../../models");
const jwt = require("jsonwebtoken");
const Validator = require("fastest-validator");
const v = new Validator();

const { JWT_SECRET, JWT_EXPIRED } = process.env;

module.exports = async (req, res) => {
  try {
    const schema = {
      email: "email|empty:false",
      password: "string|empty:false|min:5",
    };

    const validate = v.validate(req.body, schema);
    if (validate.length) {
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
  
    const isValidPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!isValidPassword) {
      return res.status(404).json({
        status: "error",
        message: "Password not correct!",
      });
    }

    const token = jwt.sign(
      { id: user.id.toString(), email: user.email, status: user.status },
      JWT_SECRET,
      {
        expiresIn: JWT_EXPIRED,
      }
    );

    await user.update({
      tokens: token,
    });

    return res.json({
      status: "success",
      data: {
        id: user.id,
        email: user.email,
        status: user.status,
        token,
      },
    });
  } catch (error) {
    return res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};
