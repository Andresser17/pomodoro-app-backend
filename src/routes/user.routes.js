import {
  insert,
  list,
  getById,
  patchById,
  removeById,
} from "../controllers/user.controller.js";
import {
  minimumPermissionLevelRequired,
  onlySameUserOrAdminCanDoThisAction,
} from "../middleware/authPermission.js";
import { validJWTNeeded } from "../middleware/authValidation.js";
import config from "../config/env.config.js";

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
