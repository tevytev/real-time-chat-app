const express = require("express");
const { getUser } = require("../Controllers/UserControllers/UserController");
const { verifyJWT } = require("../Middleware/AuthMiddleware/authMiddleware");

const router = express.Router();

router.get("/:username", getUser);

router.get("/protected/test", verifyJWT, async (req, res,) => {
    res.status(200).send("this is a protected route");
})

module.exports = router