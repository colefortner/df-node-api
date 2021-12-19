const fs = require("fs");

const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

const HttpError = require("../models/http-error");
const getCoordinatesFromAddress = require("../util/location");
const Business = require("../models/business");
const User = require("../models/user");

const getBusinessById = async (req, res, next) => {
  const businessId = req.params.id;

  let business;

  try {
    business = await Business.findById(businessId);
  } catch (err) {
    const error = new HttpError("Can not find business with that id", 500);
    return next(error);
  }

  if (!business) {
    const error = new HttpError("Could not find a business for this id", 404);
    return next(error);
  }
  res.json({ business: business.toObject({ getters: true }) });
};

const getBusinessesByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  // let businesses;
  let userWithBusinesses;
  try {
    userWithBusinesses = await User.findById(userId).populate("businesses");
    // businesses = await Business.find({ creator: userId });
  } catch (err) {
    const error = new HttpError(
      "Could not find a business associated with that user Id",
      500
    );
    return next(error);
  }

  // if(!businesses || businesses.length === 0) {
  if (!userWithBusinesses || userWithBusinesses.businesses.length === 0) {
    const error = new HttpError(
      "Could not find any businesses for the provided user id.",
      404
    );
    return next(error);
  }
  res.json({
    businesses: userWithBusinesses.businesses.map((b) =>
      b.toObject({ getters: true })
    )
  });
};

const createBusiness = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(new HttpError("Invalid input", 422));
  }

  const { id, name, description, address, creator } = req.body;

  let coordinates;

  try {
    coordinates = await getCoordinatesFromAddress(address);
  } catch (error) {
    return next(error);
  }

  const createdBusiness = new Business({
    name,
    description,
    address,
    location: coordinates,
    image: req.file.path,
    creator
  });

  let user;

  try {
    user = await User.findById(creator);
  } catch (err) {
    const error = new HttpError("Creating business failed", 500);
    return next(error);
  }

  if (!user) {
    const error = new HttpError("Could not find user id in the databse", 404);
    return next(error);
  }

  console.log(user);

  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    await createdBusiness.save({ session: session });
    user.businesses.push(createdBusiness);
    await user.save({ session: session });
    await session.commitTransaction();
  } catch (err) {
    const error = new HttpError("Creating Business Failed", 500);
    return next(error);
  }

  res.status(201).json({ business: createdBusiness });
};

const updateBusiness = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(new HttpError("Invalid input", 422));
  }

  const { name, description } = req.body;
  const businessId = req.params.id;

  let business;

  try {
    business = await Business.findById(businessId);
  } catch (err) {
    const error = new HttpError("Cannot find business with that id", 500);
    return next(error);
  }

  business.name = name;
  business.description = description;

  try {
    await business.save();
  } catch (err) {
    const error = new HttpError("Could not update business", 500);
    return next(error);
  }
  res.status(200).json({ business: business.toObject({ getters: true }) });
};

const deleteBusiness = async (req, res, next) => {
  const businessId = req.params.id;

  let business;

  try {
    business = await Business.findById(businessId).populate("creator");
  } catch (err) {
    const error = new HttpError("Cannot find business with that id", 500);
    return next(error);
  }

  if (!business) {
    const error = new HttpError("Could not find Business with that id", 404);
    return next(error);
  }

  const imagePath = business.image;

  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    await business.remove({ session: session });
    business.creator.businesses.pull(business);
    await business.creator.save({ session: session });
    await session.commitTransaction();
  } catch (err) {
    const error = new HttpError("Could not remove business", 500);
    return next(error);
  }

  fs.unlink(imagePath, (err) => {
    console.log(err);
  });

  res.status(200).json({ message: "Deleted business" });
};

exports.getBusinessById = getBusinessById;
exports.getBusinessesByUserId = getBusinessesByUserId;
exports.createBusiness = createBusiness;
exports.updateBusiness = updateBusiness;
exports.deleteBusiness = deleteBusiness;
