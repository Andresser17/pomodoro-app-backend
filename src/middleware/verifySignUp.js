import { getUserByEmail } from "../models/user.model.js";
import db from "../models/index.js";
const ROLES = db.ROLES;

export const checkDuplicateEmail = async (req, res, next) => {
  const email = await getUserByEmail(req.body.email);

  if (email)
    return res
      .status(400)
      .send({ message: "Email provided is already registered" });

  next();
};

export const checkRolesExisted = (req, res, next) => {
  if (req.body.roles) {
    for (let role of req.body.roles) {
      if (!ROLES.includes(role)) {
        return res.status(400).send({
          message: `Failed! Role ${role} does not exist!`,
        });
      }
    }
  }

  next();
};
