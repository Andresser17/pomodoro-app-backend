import dotenv from "dotenv";
import mongoose from "mongoose";
// Models
import user from "./user.model.js";
import role from "./role.model.js";
dotenv.config();

// const db = async () => await mongoose.connect(process.env.MONGO_URI, options);
const db = {
  mongoose,
  user,
  role,
  ROLES: ["user", "admin", "moderator"]
}

// db().catch((err) => console.log(err));

export default db;
