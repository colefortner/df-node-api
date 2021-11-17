const express = require("express");

const HttpError = require("../models/http-error");

const buisnessesControllers = require("../controllers/businesses-controllers");

const router = express.Router();

router.get("/:id", buisnessesControllers.getBusinessById);

router.post("/", buisnessesControllers.createBusiness);

router.patch("/:id", buisnessesControllers.updateBusiness);

router.delete("/:id", buisnessesControllers.deleteBusiness);

module.exports = router;
