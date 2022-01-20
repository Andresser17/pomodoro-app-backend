// Controller
import {
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
import { checkDuplicateEmail } from "../middleware/verifySignUp.js";
import { verifyToken, minimumRole } from "../middleware/authJwt.js";

function UsersRouter(app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // Testing all the permision roles
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
