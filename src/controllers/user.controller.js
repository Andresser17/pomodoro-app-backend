import {
  createUser,
  listUsers,
  getUserById,
  updateUser,
  deleteById,
} from "../models/user.model.js";
import db from "../models/index.js";
const { user: User } = db;

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
  getUserById(req.params.userId).then((result) => {
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

export const createTask = async (req, res) => {
  const date = new Date();

  let from = req.body.from;
  // If from property wasn't provided get actual date
  if (!req.body.from) {
    let month = String(date.getMonth() + 1);
    month = month.length === 1 ? `0${month}` : month;
    let day = String(date.getDate());
    day = day.length === 1 ? `0${day}` : day;
    const year = String(date.getFullYear());
    from = `${month}-${day}-${year}`;
  }

  let to = "";
  // if to property wasn't provided get actual date
  if (!req.body.to) {
    let month = String(date.getMonth() + 1);
    month = month.length === 1 ? `0${month}` : month;
    let day = String(date.getDate());
    day = day.length === 1 ? `0${day}` : day;
    const year = String(date.getFullYear());
    // If from property wasn't provided
    to = `${month}-${day}-${year}`;
  }

  const newTask = {
    title: req.body.title,
    description: req.body.description,
    completed: req.body.completed,
    pomodoros: req.body.pomodoros,
    from,
    to,
  };

  const created = await User.createTask(req.params.userId, newTask).catch(
    (err) => res.status(500).json({ err: err })
  );

  if (!created) return res.status(400).json({ message: "Task not created" });

  // Return user tasks array
  return res.status(200).json(created.tasks);
};

export const getUserSettings = async (req, res) => {
  const user = await User.getUserSettings(req.params.userId).catch((err) =>
    res.status(500).json({ err: err })
  );

  return res.status(200).json(user);
};

export const changeUserSettings = async (req, res) => {
  const changed = await User.changeUserSettings(
    req.params.userId,
    req.body
  ).catch((err) => res.status(500).json({ err: err }));

  return res.status(204);
};

// Test authorizations

export const allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

export const userBoard = (req, res) => {
  res.status(200).send("User Content.");
};

export const adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};

export const moderatorBoard = (req, res) => {
  res.status(200).send("Moderator Content.");
};
