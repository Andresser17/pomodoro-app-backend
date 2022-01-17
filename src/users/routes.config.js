import {
  insert,
  list,
  getById,
  patchById,
  removeById,
} from "./controllers/users.controller.js";
import {
  minimumPermissionLevelRequired,
  onlySameUserOrAdminCanDoThisAction,
} from "../common/middlewares/auth.permission.middleware.js";
import { validJWTNeeded } from "../common/middlewares/auth.validation.middleware.js";
import config from "../common/config/env.config.js";

const ADMIN = config.permissionLevels.ADMIN;
const PAID = config.permissionLevels.PAID_USER;
const FREE = config.permissionLevels.NORMAL_USER;

function UsersRouter(app) {
  app.post("/users", [insert]);
  app.get("/users", [
    validJWTNeeded,
    minimumPermissionLevelRequired(PAID),
    list,
  ]);
  app.get("/users/:userId", [
    validJWTNeeded,
    minimumPermissionLevelRequired(FREE),
    onlySameUserOrAdminCanDoThisAction,
    getById,
  ]);
  app.patch("/users/:userId", [
    validJWTNeeded,
    minimumPermissionLevelRequired(FREE),
    onlySameUserOrAdminCanDoThisAction,
    patchById,
  ]);
  app.delete("/users/:userId", [
    validJWTNeeded,
    minimumPermissionLevelRequired(ADMIN),
    removeById,
  ]);
}

export default UsersRouter;
