const { v4: uuid } = require("uuid");
const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
const User = require("../models/user");

const users = [
  {
    id: "1",
    name: "Todd",
    email: "todd@todd.com",
    password: "123456"
  }
];

const getUsers = (req, res, next) => {
  // sends back all users
  res.json({ users: users });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(new HttpError("Invalid input", 422));
  }

  const { name, email, password, businesses } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("Signup failed", 500);
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      "Email already associated with an account",
      422
    );
    return next(error);
  }

  const createdUser = new User({
    name,
    email,
    image:
      "https://i2-prod.ok.co.uk/incoming/article23299695.ece/ALTERNATES/s1200c/4_GettyImages-1228924141.jpg",
    password,
    businesses
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError("Creating user Failed", 500);
    return next(error);
  }

  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("Login failed", 500);
    return next(error);
  }

  if (!existingUser || password !== existingUser.password) {
    const error = new HttpError("Invalid credentials", 401);
    return next(error);
  }
  res.json({ message: "Successful login" });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
