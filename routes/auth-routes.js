const router = require("express").Router();
const { addUser, loginUser, addAdmin } = require("../controllers/login-and-registration");
const { authMiddleware, role } = require("../middleware/auth-middleware");

router.post("/register", addUser);
router.post("/seedAdmin", addAdmin)
router.post("/login",loginUser)

module.exports = router;