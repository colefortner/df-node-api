const express = require("express");

const { check } = require("express-validator");

const businessesControllers = require("../controllers/businesses-controllers");
const fileUpload = require("../middleware/file-upload");

const router = express.Router();

router.get("/:id", businessesControllers.getBusinessById);

router.get("/user/:uid", businessesControllers.getBusinessesByUserId);

router.post(
  "/",
  fileUpload.single("image"),
  [check("name").not().isEmpty(), check("description").isLength({ min: 5 })],
  businessesControllers.createBusiness
);

router.patch(
  "/:id",
  [check("name").not().isEmpty(), check("description").isLength({ min: 5 })],
  businessesControllers.updateBusiness
);

router.delete("/:id", businessesControllers.deleteBusiness);

module.exports = router;
