const express = require("express");
const { verifyJWT } = require("../Middleware/AuthMiddleware/authMiddleware");
const { getUser } = require("../Controllers/UserControllers/UserController");


const router = express.Router();

router.get("/:username", getUser);

router.get("/protected/test", verifyJWT, async (req, res,) => {
    res.status(200).json({ message: "this is a protected route", user: req.user });
});

module.exports = router;