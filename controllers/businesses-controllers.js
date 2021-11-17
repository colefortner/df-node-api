const { v4: uuid } = require("uuid");
const HttpError = require("../models/http-error");

const businesses_data = [
  { id: "1", name: "Pinellas Ale House", description: "bar" },
  { id: "2", name: "Three Daughters Brewing", description: "bar" }
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

const createBusiness = (req, res, next) => {
  const { id, name, description } = req.body;

  const createdBusiness = {
    id: uuid(),
    name,
    description
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

const deleteBusiness = (req, res, next) => {};

exports.getBusinessById = getBusinessById;
exports.createBusiness = createBusiness;
exports.updateBusiness = updateBusiness;
exports.deleteBusiness = deleteBusiness;
