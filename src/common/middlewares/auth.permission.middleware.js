import config from "../config/env.config.js";

export const minimumPermissionLevelRequired = (required_permission_level) => {
  const middleware = (req, res, next) => {
    let user_permission_level = parseInt(req.jwt.permissionLevel);

    if (!user_permission_level && !required_permission_level)
      return res.status(403).send();

    return next();
  };

  return middleware;
};

export const onlySameUserOrAdminCanDoThisAction = (req, res, next) => {
  let user_permission_level = parseInt(req.jwt.permissionLevel);
  let userId = req.jwt.userId;

  if (req.params && req.params.userId && userId === req.params.userId) {
    return next();
  } else {
    if (user_permission_level && config.permissionLevel.ADMIN) {
      return next();
    } else {
      return res.status(403).send();
    }
  }
};

export const sameUserCantDoThisAction = (req, res, next) => {
  let userId = req.jwt.userId;
  if (req.params.userId !== userId) {
    return next();
  } else {
    return res.status(400).send();
  }
};
