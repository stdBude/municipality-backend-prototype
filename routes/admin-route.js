const router = require("express").Router();
const { authMiddleware, role } = require("../middleware/auth-middleware");

router.post("/", authMiddleware, role, (req, res) => {
    res.status(200).json({message: "You are logged in", 
        user: req.userInfo,
        success: true});
});

module.exports = router;