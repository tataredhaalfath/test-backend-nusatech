const { User, Wallet } = require("../../../models");

module.exports = async (req, res) => {
  try {
    const id = req.user.id;
    const user = await User.findOne({
      where: {
        id: id,
      },
      attributes: ["id", "email", "status","createdAt","updatedAt"],
      include: [{ model: Wallet, as: "wallets", attributes: ["id", "amount"], include: "currency" }],
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

    return res.json({
      staus: "success",
      data: user,
    });
  } catch (error) {
    return res.status(400).json({
      status: "error",
      messag: error.message,
    });
  }
};
