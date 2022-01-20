import mongoose from "mongoose";

const roleSchema = new mongoose.Schema({
  name: String,
});

const Role = mongoose.model("Role", roleSchema);

// Methods
export const createRole = async (role) => {
  const saved = await new Role({
    name: role,
  }).save();

  if (!saved) {
    return console.error(saved);
  }

  return console.log(`added ${role} to roles collection`);
};

export const getRoles = async (userRoles) => {
  const roles = await Role.find({ _id: { $in: userRoles } });

  return roles;
};

export default Role;
