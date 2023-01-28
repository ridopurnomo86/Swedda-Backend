const { Router } = require("express");
const router = Router();
const accountControllers = require("../controllers/AccountControllers");
const limiter = require("../middleware/limiter");

router.post("/auth/signup", accountControllers.signup_post);
router.post("/auth/signin", limiter, accountControllers.signin_post);
router.get("/auth/logout", accountControllers.logout_get);

module.exports = router;
