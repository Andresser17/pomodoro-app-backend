// Controller
import {
  insert,
  list,
  getById,
  patchById,
  removeById,
  allAccess,
  adminBoard,
  userBoard,
  moderatorBoard,
} from "../controllers/user.controller.js";
// Middleware
import {
  minimumPermissionLevelRequired,
  onlySameUserOrAdminCanDoThisAction,
} from "../middleware/authPermission.js";
import { checkDuplicateEmail } from "../middleware/verifySignUp.js";
import { verifyToken, minimumRole } from "../middleware/authJwt.js";
import { validJWTNeeded } from "../middleware/authValidation.js";
import config from "../config/env.config.js";

const ADMIN = config.permissionLevels.ADMIN;
const PAID = config.permissionLevels.PAID_USER;
const FREE = config.permissionLevels.NORMAL_USER;

function UsersRouter(app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/test/all", allAccess);

  app.get("/api/test/user", [verifyToken], userBoard);

  app.get(
    "/api/test/mod",
    [verifyToken, minimumRole("moderator")],
    moderatorBoard
  );

  app.get("/api/test/admin", [verifyToken, minimumRole("admin")], adminBoard);
  // app.post("/users", [checkDuplicateEmail, insert]);
  // app.get("/users", [
  //   validJWTNeeded,
  //   minimumPermissionLevelRequired(PAID),
  //   list,
  // ]);
  // app.get("/users/:userId", [
  //   minimumRole("admin"),
  //   // validJWTNeeded,
  //   // minimumPermissionLevelRequired(FREE),
  //   // onlySameUserOrAdminCanDoThisAction,
  //   getById,
  // ]);
  // app.patch("/users/:userId", [
  //   validJWTNeeded,
  //   minimumPermissionLevelRequired(FREE),
  //   onlySameUserOrAdminCanDoThisAction,
  //   patchById,
  // ]);
  // app.delete("/users/:userId", [
  //   validJWTNeeded,
  //   minimumPermissionLevelRequired(ADMIN),
  //   removeById,
  // ]);
}

export default UsersRouter;
