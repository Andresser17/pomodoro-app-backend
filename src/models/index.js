import mongoose from "mongoose";
// Models
import user from "./user.model.js";
import role from "./role.model.js";
import refreshToken from "./refreshToken.model.js";

const db = {
  mongoose,
  user,
  role,
  refreshToken,
  ROLES: ["user", "admin", "moderator"]
}

export default db;
