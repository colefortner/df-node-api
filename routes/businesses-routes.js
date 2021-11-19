const express = require("express");

const { check } = require("express-validator");

const buisnessesControllers = require("../controllers/businesses-controllers");

const router = express.Router();

router.get("/:id", buisnessesControllers.getBusinessById);

router.get("/user/:uid", buisnessesControllers.getBusinessesByUserId);

router.post(
  "/",
  [check("name").not().isEmpty(), check("description").isLength({ min: 5 })],
  buisnessesControllers.createBusiness
);

router.patch(
  "/:id",
  [check("name").not().isEmpty(), check("description").isLength({ min: 5 })],
  buisnessesControllers.updateBusiness
);

router.delete("/:id", buisnessesControllers.deleteBusiness);

module.exports = router;
