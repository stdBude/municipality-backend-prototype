const router = require("express").Router();
const { authMiddleware, role } = require("../middleware/auth-middleware");
const { getAllRequests, getRequestById, createRequest, deleteRequest, getRequestByUser } = require("../controllers/requests");
const {uploadImage} = require("../middleware/upload-middleware")

router.get("/requests/getAll", authMiddleware, role, getAllRequests);
router.get("/requests/getById/:id", authMiddleware, getRequestById);
router.get("/requests/getByUser/:id", authMiddleware, getRequestByUser);
router.post("/requests/create", authMiddleware, uploadImage.single("image"), createRequest);
router.delete("/requests/delete/:id", authMiddleware, deleteRequest);

module.exports = router;