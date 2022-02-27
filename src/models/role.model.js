import mongoose from "mongoose";

const roleSchema = new mongoose.Schema({
  name: String,
});

roleSchema.statics.createRole = async function (role) {
  const saved = await new Role({
    name: role,
  }).save();

  return saved;
};

roleSchema.statics.getRoles = async function (userRoles) {
  const roles = await Role.find({ _id: { $in: userRoles } });

  return roles;
};

roleSchema.statics.getRolesByName = async function (userRoles) {
  const roles = await Role.find({ name: { $in: userRoles } });

  return roles;
};

roleSchema.statics.getOneRole = async function (filter) {
  const role = await Role.findOne(filter);

  return role;
};

const Role = mongoose.model("Role", roleSchema);

export default Role;
