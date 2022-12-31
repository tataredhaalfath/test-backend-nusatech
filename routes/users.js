const express = require("express");
const verifyToken = require("../middlewares/verifyToken");
const router = express.Router();

const userHandler = require("./handler/users");

router.post("/signup", userHandler.signUp);
router.post("/signin", userHandler.signIn);
router.post("/signout", verifyToken, userHandler.signOut);
router.put("/update", verifyToken, userHandler.update);
router.get("/detail", verifyToken, userHandler.getUser);

router.get("/confirm/:code", userHandler.verifyUser);

module.exports = router;
