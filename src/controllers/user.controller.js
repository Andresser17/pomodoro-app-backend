// Models
import db from "../models/index.js";
// Helpers
import handleAsyncError from "../helpers/handleAsyncError.js";
const { user: User } = db;

export const listUsers = (req, res) => {
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

  const [data, err] = handleAsyncError(User.listUsers(limit, page));

  if (err) return res.status(500).json({ err: "Internal server error" });

  return res.status(200).send(data);
};

export const getUserById = (req, res) => {
  const [data, err] = handleAsyncError(User.getUserById(req.params.userId));

  if (err) return res.status(500).json({ err: "Internal server error" });

  return res.status(200).send(data);
};

export const updateUserById = (req, res) => {
  if (req.body.password) {
    let salt = crypto.randomBytes(16).toString("base64");
    let hash = crypto
      .createHmac("sha512", salt)
      .update(req.body.password)
      .digest("base64");
    req.body.password = salt + "$" + hash;
  }

  const [, err] = handleAsyncError(
    User.updateUser(req.params.userId, req.body)
  );

  if (err) return res.status(500).json({ err: "Internal server error" });

  return res.status(204).send();
};

export const deleteUserById = (req, res) => {
  const [, err] = handleAsyncError(User.deleteById(req.params.userId));

  if (err) return res.status(500).json({ err: "Internal server error" });

  return res.status(204).send();
};

export const getUserTasks = async (req, res) => {
  const [tasks, err] = await handleAsyncError(User.getTasks(req.params.userId));

  if (err) return res.status(500).json({ err: "Internal server error" });

  return res.status(200).json(tasks);
};

export const createUserTask = async (req, res) => {
  // Task template
  const newTask = {
    title: req.body.title,
    description: req.body.description,
    completedPomodoros: req.body.completedPomodoros,
    expectedPomodoros: req.body.expectedPomodoros,
    color: req.body.color,
    completed: req.body.completed,
  };

  // Add task to db
  const [created, err] = await handleAsyncError(
    User.createTask(req.params.userId, newTask)
  );

  if (err) return res.status(500).json({ err: "Internal server error" });

  // Return user tasks array
  return res.status(200).json(created.tasks);
};

export const updateUserTask = async (req, res) => {
  const [, err] = await handleAsyncError(
    User.updateTask(req.params.userId, req.params.taskId, req.body)
  );

  if (err) return res.status(500).json({ err: "Internal server error" });

  return res.status(204).send();
};

export const getUserSettings = async (req, res) => {
  const [user, err] = await handleAsyncError(
    User.getUserSettings(req.params.userId)
  );

  if (err) return res.status(500).json({ err: "Internal server error" });

  const { _id, ...data } = { ...user.toObject() };

  return res.status(200).json(data);
};

export const updateUserSettings = async (req, res) => {
  const [, err] = await handleAsyncError(
    User.updateUserSettings(req.params.userId, req.body)
  );

  if (err) return res.status(500).json({ err: "Internal server error" });

  return res.status(204).send();
};

export const updateTimerMode = async (req, res) => {
  const [, err] = await handleAsyncError(
    User.updateTimerMode(req.params.userId, req.body)
  );

  if (err) return res.status(500).json({ err: "Internal server error" });

  return res.status(204).send();
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
