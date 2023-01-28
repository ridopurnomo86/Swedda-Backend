const { Router } = require("express");
const router = Router();
const profileControllers = require("../controllers/ProfileControllers");
const requireAuth = require("../middleware/auth");
const upload = require("../middleware/upload");
const limiter = require("../middleware/limiter");

router.get("/user/info", requireAuth, profileControllers.user_info_get);
router.put("/user/info", profileControllers.user_info_put);
router.post("/user/verify", limiter, requireAuth, profileControllers.verify_user_post);
router.get("/user/verify/:id", profileControllers.verify_user_get);
router.post(
	"/user/upload",
	upload.single("image_profile"),
	profileControllers.user_profile_img_post
);

module.exports = router;
