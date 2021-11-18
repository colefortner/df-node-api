const { v4: uuid } = require("uuid");
const HttpError = require("../models/http-error");

let businesses_data = [
  { id: "1", name: "Pinellas Ale House", description: "bar", creator: "2" },
  { id: "2", name: "Three Daughters Brewing", description: "bar", creator: "2" }
];

const getBusinessById = (req, res, next) => {
  const businessId = req.params.id;
  const business = businesses_data.find((b) => {
    return b.id === businessId;
  });
  if (!business) {
    throw new HttpError("Could not find a business for this id", 404);
  }
  res.json({ business });
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

const createBusiness = (req, res, next) => {
  const { id, name, description } = req.body;

  const createdBusiness = {
    id: uuid(),
    name,
    description,
    creator
  };
  businesses_data.push(createdBusiness);

  res.status(201).json({ business: createdBusiness });
};

const updateBusiness = (req, res, next) => {
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

  businesses_data = businesses_data.filter((b) => b.id !== businessId);
  res.status(200).json({ message: "Deleted business" });
};

exports.getBusinessById = getBusinessById;
exports.getBusinessesByUserId = getBusinessesByUserId;
exports.createBusiness = createBusiness;
exports.updateBusiness = updateBusiness;
exports.deleteBusiness = deleteBusiness;
