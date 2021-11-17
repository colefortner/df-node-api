const express = require("express");

const buisnessesControllers = require("../controllers/businesses-controllers");

const router = express.Router();

router.get("/:id", buisnessesControllers.getBusinessById);

router.post("/", buisnessesControllers.createBusiness);

module.exports = router;
