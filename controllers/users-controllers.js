const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
const User = require("../models/user");

const getUsers = async (req, res, next) => {
  // sends back all users
  let users;
  try {
    users = await User.find({}, "-password");
  } catch (err) {
    const error = new HttpError("Fetching users failed", 500);
    return next(error);
  }
  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(new HttpError("Invalid input", 422));
  }

  const { name, email, password } = req.body;

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
    image: req.file.path,
    password,
    businesses: []
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
  res.json({
    message: "Successful login",
    user: existingUser.toObject({ getters: true })
  });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
