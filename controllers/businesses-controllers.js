const { v4: uuid } = require("uuid");
const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
const getCoordinatesFromAddress = require("../util/location");
const Business = require("../models/business");

let businesses_data = [
  {
    id: "1",
    name: "Pinellas Ale House",
    description: "bar",
    address: "1962 1st Avenue S St. Petersburg, FL 33712",
    creator: "2"
  },
  {
    id: "2",
    name: "Three Daughters Brewing",
    description: "bar",
    address: "222 22nd Street South, St. Petersburg, FL 33712",
    creator: "2"
  }
];

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

const getBusinessesByUserId = (req, res, next) => {
  const userId = req.params.uid;

  const businesses = businesses_data.filter((b) => b.creator === userId);

  if (!businesses || businesses.length === 0) {
    throw new HttpError(
      "Could not find any businesses for the provided user id.",
      404
    );
  }
  res.json({ businesses });
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
    image:
      "https://i2-prod.ok.co.uk/incoming/article23299695.ece/ALTERNATES/s1200c/4_GettyImages-1228924141.jpg",
    creator
  });

  try {
    await createdBusiness.save();
  } catch (err) {
    const error = new HttpError("Creating Business Failed", 500);
    return next(error);
  }

  res.status(201).json({ business: createdBusiness });
};

const updateBusiness = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    throw new HttpError("Invalid input", 422);
  }

  const { name, description } = req.body;
  const businessId = req.params.id;
  const updatedBusiness = {
    ...businesses_data.find((b) => b.id === businessId)
  };
  const businessIndex = businesses_data.findIndex((b) => b.id === businessId);
  updatedBusiness.name = name;
  updatedBusiness.description = description;

  businesses_data[businessIndex] = updatedBusiness;

  res.status(200).json({ business: updatedBusiness });
};

const deleteBusiness = (req, res, next) => {
  const businessId = req.params.id;
  // check to see if we have a place before we try to delete it
  if (!businesses_data.find((b) => b.id === businessId)) {
    throw new HttpError("No Business with that id", 404);
  }
  businesses_data = businesses_data.filter((b) => b.id !== businessId);
  res.status(200).json({ message: "Deleted business" });
};

exports.getBusinessById = getBusinessById;
exports.getBusinessesByUserId = getBusinessesByUserId;
exports.createBusiness = createBusiness;
exports.updateBusiness = updateBusiness;
exports.deleteBusiness = deleteBusiness;
