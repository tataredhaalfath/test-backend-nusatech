const { User, Mailer } = require("../../../models");

module.exports = async (req, res) => {
  try {
    const mailer = await Mailer.findOne({
      where: {
        pin: req.params.code,
      },
    });
    if (!mailer) {
      return res.status(404).json({
        message: "not found!",
      });
    }

    const user = await User.findOne({ where: { email: mailer.email } });
    user.status = "verified";
    mailer.status = "verified";
    await user.save();
    await mailer.save();

    return res.json({
      status: "success",
      message: "Verification Success",
    });
  } catch (error) {
    return res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};
