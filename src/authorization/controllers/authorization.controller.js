import config from "../../common/config/env.config.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
// const uuid = require("uuid");

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
