import config from "../config/env.config.js";

export const minimumPermissionLevelRequired = (requiredPermissionLevel) => {
  const middleware = (req, res, next) => {
    let userPermissionLevel = parseInt(req.jwt.permissionLevel);

    if (userPermissionLevel !== requiredPermissionLevel)
      return res.status(403).send();

    return next();
  };

  return middleware;
};

export const onlySameUserOrAdminCanDoThisAction = (req, res, next) => {
  let userPermissionLevel = parseInt(req.jwt.permissionLevel);
  let userId = req.jwt.userId;

  // User is the same or is an admin
  if (
    userId === req.params.userId ||
    userPermissionLevel === config.permissionLevels.ADMIN
  ) {
    return next();
  }

  return res.status(403).send();
};

export const sameUserCantDoThisAction = (req, res, next) => {
  let userId = req.jwt.userId;
  if (req.params.userId !== userId) {
    return next();
  } else {
    return res.status(400).send();
  }
};
