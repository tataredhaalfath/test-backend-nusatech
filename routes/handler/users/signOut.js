const {User} = require("../../../models");

module.exports = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found!",
      });
    }

    await user.update({
      tokens: null,
    });

    return res.json({
      status: "succes",
      message: "logout success",
    });
  } catch (error) {
    return res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};
