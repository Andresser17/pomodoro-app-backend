import config from "../config/env.config.js";
import authConfig from "../config/auth.config.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
// Models
import db from "../models/index.js";
import { createUser, getUserByEmail } from "../models/user.model.js";
import { getRolesByName, getOneRole } from "../models/role.model.js";
import { getRefreshToken } from "../models/refreshToken.model.js";

const { refreshToken: RefreshToken } = db;

export const signUp = async (req, res) => {
  const user = await createUser({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
  });

  if (req.body.roles) {
    const roles = await getRolesByName(req.body.roles).catch((err) => {
      return res.status(500).send({ message: err });
    });

    // Add roles to created user
    user.roles = roles.map((role) => role._id);
    const saved = await user.save().catch((err) => {
      return res.status(500).send({ message: err });
    });

    return res.send({ message: "User was registered successfully!" });
  }
  const role = await getOneRole({ name: "user" }).catch((err) => {
    return res.status(500).send({ message: err });
  });

  // Add role to created user
  user.roles = [role._id];
  const saved = user.save().catch((err) => {
    if (err) {
      return res.status(500).send({ message: err });
    }
  });

  return res.send({ message: "User was registered successfully!" });
};

export const signIn = async (req, res) => {
  const user = await getUserByEmail(req.body.email, ["roles", "-__v"]).catch(
    (err) => res.status(500).send({ message: err })
  );

  if (!user) {
    return res.status(404).send({ message: "User Not found." });
  }

  const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

  if (!passwordIsValid) {
    return res.status(401).send({
      accessToken: null,
      message: "Invalid Password!",
    });
  }

  const token = jwt.sign({ id: user.id }, authConfig.secret, {
    expiresIn: authConfig.jwtExpiration,
  });

  const refreshToken = await RefreshToken.createToken(user);

  const authorities = [];

  for (let role of user.roles) {
    authorities.push("ROLE_" + role.name.toUpperCase());
  }

  res.status(200).send({
    id: user._id,
    username: user.username,
    email: user.email,
    roles: authorities,
    accessToken: token,
    refreshToken,
  });
};

export const refreshToken = async (req, res) => {
  const { refreshToken: requestToken } = req.body;

  if (requestToken == null) {
    return res.status(403).json({ message: "Refresh Token is required!" });
  }

  const refreshToken = await getRefreshToken(requestToken).catch((err) =>
    res.status(500).json({ message: err })
  );

  if (!refreshToken) {
    res.status(403).json({ message: "Refresh token is not in database!" });
    return;
  }

  if (RefreshToken.verifyExpiration(refreshToken)) {
    RefreshToken.findByIdAndRemove(refreshToken._id, {
      useFindAndModify: false,
    }).exec();

    res.status(403).json({
      message: "Refresh token was expired. Please make a new signin request",
    });
    return;
  }

  const newAccessToken = jwt.sign(
    { id: refreshToken.user._id },
    authConfig.secret,
    {
      expiresIn: authConfig.jwtExpiration,
    }
  );

  return res.status(200).json({
    accessToken: newAccessToken,
    refreshToken: refreshToken.token,
  });
};
