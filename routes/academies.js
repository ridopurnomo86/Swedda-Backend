const { Router } = require("express");
const router = Router();
const academiesControllers = require("../controllers/AcademiesControllers");
const requireAuth = require("../middleware/auth");

router.post("/academies", requireAuth, academiesControllers.academies_post);

module.exports = router;
