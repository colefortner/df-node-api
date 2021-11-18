const { v4: uuid } = require("uuid");

const HttpError = require("../models/http-error");

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

const signup = (req, res, next) => {
  const { name, email, password } = req.body;

  const userExists = users.find((u) => u.email === email);
  if (userExists) {
    throw new HttpError("Email already has an account associated with it", 422);
  }

  const createdUser = {
    id: uuid(),
    name,
    email,
    password
  };

  users.push(createdUser);

  res.status(201).json({ user: createdUser });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  const userFound = users.find((u) => u.email === email);
  if (!userFound) {
    throw new HttpError("User not found", 401);
  }
  if (userFound.password !== password) {
    throw new HttpError("Incorrect password", 401);
  }
  res.json({ message: "Successful login" });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
