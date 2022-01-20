import config from "../config/env.config.js";
import authConfig from "../config/auth.config.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
// Models
import { createUser, getUserByEmail } from "../models/user.model.js";
import { getRolesByName, getOneRole } from "../models/role.model.js";
// import crypto from "crypto";

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
  const user = await getUserByEmail(req.body.email, ["roles", "-__v"]).catch((err) => res.status(500).send({ message: err }));

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
    expiresIn: 86400, // 24 hours
  });

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
  });

  // User.findOne({
  //   username: req.body.username,
  // })
  //   .populate("roles", "-__v")
  //   .exec((err, user) => {
  //     if (err) {
  //       res.status(500).send({ message: err });
  //       return;
  //     }

  //     if (!user) {
  //       return res.status(404).send({ message: "User Not found." });
  //     }
  //   });
};

export const login = (req, res) => {
  try {
    let refreshId = req.body.userId + config.jwtSecret;
    let salt = crypto.randomBytes(16).toString("base64");
    let hash = crypto
      .createHmac("sha512", salt)
      .update(refreshId)
      .digest("base64");
    req.body.refreshKey = salt;
    let token = jwt.sign(req.body, config.jwtSecret);
    let b = Buffer.from(hash);
    let refreshToken = b.toString("base64");

    res.status(201).send({
      accessToken: token,
      refreshToken: refreshToken,
    });
  } catch (err) {
    res.status(500).send({ errors: err });
  }
};

export const refresh_token = (req, res) => {
  try {
    req.body = req.jwt;
    let token = jwt.sign(req.body, config.jwtSecret);
    res.status(201).send({ id: token });
  } catch (err) {
    res.status(500).send({ errors: err });
  }
};
