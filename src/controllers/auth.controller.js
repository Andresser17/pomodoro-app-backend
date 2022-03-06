import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
// Configs
import authConfig from "../config/auth.config.js";
import userConfig from "../config/user.config.js";
// Helpers
import handleAsyncError from "../helpers/handleAsyncError.js";
// Models
import db from "../models/index.js";
const { user: User, refreshToken: RefreshToken, role: Role } = db;

export const signUp = async (req, res) => {
  const [user, err] = await handleAsyncError(
    User.createUser({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
      // Add default settings to new user.
      settings: userConfig,
    })
  );

  if (err) return res.status(500).json({ err: "Internal server error" });

  try {
    if (req.body.roles) {
      const roles = await Role.getRolesByName(req.body.roles);

      // Add roles to created user
      user.roles = roles.map((role) => role._id);
      await user.save();

      return res
        .status(200)
        .json({ message: "User was registered successfully!" });
    }
    // If roles wasn't provided.
    const role = await Role.getOneRole({ name: "user" });

    // Add role to created user
    user.roles = [role._id];
    await user.save();
  } catch (err) {
    return res.status(500).json({ err: "Internal server error" });
  }

  return res.status(200).json({ message: "User was registered successfully!" });
};

export const signIn = async (req, res) => {
  const [user, err] = await handleAsyncError(
    User.getUserByEmail(req.body.email, ["roles", "-__v"])
  );

  if (err) return res.status(500).json({ err: "Internal server error" });

  if (!user) {
    return res.status(404).json({ message: "User Not found." });
  }

  const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

  if (!passwordIsValid) {
    return res.status(401).json({
      accessToken: null,
      message: "Invalid Password!",
    });
  }

  // Create a new access token
  const accessToken = jwt.sign({ id: user.id }, authConfig.secret, {
    expiresIn: authConfig.jwtExpiration,
  });

  // Create a new refresh token
  const refreshToken = await RefreshToken.createToken(user);

  // Get roles by id and map
  let roles = (await Role.getRoles(user.roles)).map(
    (role) => "ROLE_" + role.name.toUpperCase()
  );

  res.status(200).json({
    id: user._id,
    username: user.username,
    email: user.email,
    roles,
    accessToken,
    refreshToken,
  });
};

export const getNewAccessToken = async (req, res) => {
  const { refreshToken: requestToken } = req.body;

  if (requestToken == null) {
    return res.status(403).json({ message: "Refresh Token is required!" });
  }

  // Get user refresh token
  const [userRefreshToken, err] = await handleAsyncError(
    RefreshToken.getRefreshToken(requestToken)
  );

  if (err) return res.status(500).json({ err: "Internal server error" });

  if (!userRefreshToken) {
    res.status(403).json({ message: "Refresh token is not in database!" });
    return;
  }

  // If user refresh token expired, remove from db
  if (RefreshToken.verifyExpiration(userRefreshToken)) {
    await RefreshToken.findByIdAndRemove(userRefreshToken._id);

    res.status(403).json({
      message: "Refresh token was expired. Please make a new signin request",
    });

    return;
  }

  const newAccessToken = jwt.sign(
    { id: userRefreshToken.user._id },
    authConfig.secret,
    {
      expiresIn: authConfig.jwtExpiration,
    }
  );

  return res.status(200).json({
    accessToken: newAccessToken,
    refreshToken: userRefreshToken.token,
  });
};
