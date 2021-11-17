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

exports.getBusinessById = getBusinessById;
exports.createBusiness = createBusiness;
