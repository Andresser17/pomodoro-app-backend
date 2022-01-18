import {
  createUser,
  listUsers,
  findById,
  updateUser,
  deleteById,
} from "../models/user.model.js";
import crypto from "crypto";

export const insert = (req, res) => {
  let salt = crypto.randomBytes(16).toString("base64");
  let hash = crypto
    .createHmac("sha512", salt)
    .update(req.body.password)
    .digest("base64");
  req.body.password = salt + "$" + hash;
  req.body.permissionLevel = 1;
  createUser(req.body).then((result) => {
    res.status(201).send({ id: result._id });
  });
};

export const list = (req, res) => {
  // let limit =
  //     req.query.limit && req.query.limit <= 100
  //         ? parseInt(req.query.limit)
  //         : 10;
  let limit = 10;
  let page = 0;
  if (req.query) {
    if (req.query.page) {
      req.query.page = parseInt(req.query.page);
      page = Number.isInteger(req.query.page) ? req.query.page : 0;
    }
  }
  listUsers(limit, page).then((result) => {
    res.status(200).send(result);
  });
};

export const getById = (req, res) => {
  findById(req.params.userId).then((result) => {
    res.status(200).send(result);
  });
};
export const patchById = (req, res) => {
  if (req.body.password) {
    let salt = crypto.randomBytes(16).toString("base64");
    let hash = crypto
      .createHmac("sha512", salt)
      .update(req.body.password)
      .digest("base64");
    req.body.password = salt + "$" + hash;
  }

  updateUser(req.params.userId, req.body).then((result) => {
    res.status(204).send({});
  });
};

export const removeById = (req, res) => {
  deleteById(req.params.userId).then((result) => {
    res.status(204).send({});
  });
};
