import dotenv from "dotenv";
import mongoose from "mongoose";
// Models
import user from "./user.model.js";
import role from "./role.model.js";

const db = {
  mongoose,
  user,
  role,
  ROLES: ["user", "admin", "moderator"]
}

export default db;
