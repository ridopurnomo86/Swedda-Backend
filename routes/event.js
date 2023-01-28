const { Router } = require("express");
const router = Router();
const eventsController = require("../controllers/EventControllers");
const cache = require("../middleware/caching");

router.get("/events", cache("3 minutes"), eventsController.events_get);

module.exports = router;
