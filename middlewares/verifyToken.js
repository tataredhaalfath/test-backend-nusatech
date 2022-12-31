const jwt = require("jsonwebtoken");
const { User } = require("../models");
const { JWT_SECRET } = process.env;

module.exports = async (req, res, next) => {
  try {
    if (!req.header("Authorization")) {
      throw new Error("Authorization Not Found!");
    }
    const token = await req.header("Authorization").replace("Bearer ", "");
    const decode = jwt.verify(token, JWT_SECRET);

    const user = await User.findOne({
      where: {
        id: decode.id,
        tokens: token,
      },
    });
    if (!user) {
      throw new Error("Invalid Token!");
    }

    req.user = decode;
    req.user.token = token;
    return next();
  } catch (error) {
    return res.status(500).json({ messge: error.message });
  }
};
