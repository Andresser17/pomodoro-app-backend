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
  createTask,
  getUserSettings
} from "../controllers/user.controller.js";
// Middleware
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
  app.get("/api/users", [verifyToken, minimumRole("user")], list);
  app.get("/api/users/:userId", [verifyToken, minimumRole("user")], getById);
  app.patch("/api/users/:userId", [verifyToken, minimumRole("user")], patchById);
  app.delete(
    "/api/users/:userId",
    [verifyToken, minimumRole("admin")],
    removeById
  );
  app.post("/api/tasks/:userId", [verifyToken, minimumRole("user")], createTask);
  // Get user settings
  app.get("/api/users/:userId/settings", [verifyToken, minimumRole("user")], getUserSettings);
}

export default UsersRouter;
