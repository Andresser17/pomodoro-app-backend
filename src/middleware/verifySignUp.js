import { findByEmail } from "../models/user.model.js";
import db from "../models/index.js";
const ROLES = db.ROLES;

export const checkDuplicateEmail = async (req, res, next) => {
  const email = await findByEmail(req.body.email);
  console.log(email);
  next();
};
