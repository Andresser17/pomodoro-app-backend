// Controller
import {
  listUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  allAccess,
  adminBoard,
  userBoard,
  moderatorBoard,
  getUserSettings,
  updateUserSettings,
  updateTimerMode,
  getUserTasks,
  createUserTask,
  updateUserTask,
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
  app.get("/api/users", [verifyToken, minimumRole("user")], listUsers);
  // Get user by Id
  app.get(
    "/api/users/:userId",
    [verifyToken, minimumRole("user")],
    getUserById
  );
  // Update user
  app.patch(
    "/api/users/:userId",
    [verifyToken, minimumRole("user")],
    updateUserById
  );
  app.delete(
    "/api/users/:userId",
    [verifyToken, minimumRole("admin")],
    deleteUserById
  );
  // Get user settings
  app.get(
    "/api/users/:userId/settings",
    [verifyToken, minimumRole("user")],
    getUserSettings
  );
  // Update user settings
  app.patch(
    "/api/users/:userId/settings",
    [verifyToken, minimumRole("user")],
    updateUserSettings
  );
  // Update a timer mode
  app.patch(
    "/api/users/:userId/timermodes",
    [verifyToken, minimumRole("user")],
    updateTimerMode
  );
  // Get user's tasks
  app.get(
    "/api/users/:userId/tasks",
    [verifyToken, minimumRole("user")],
    getUserTasks
  );
  // Create new task
  app.post(
    "/api/users/:userId/tasks",
    [verifyToken, minimumRole("user")],
    createUserTask
  );
  // Update a task
  app.patch(
    "/api/users/:userId/tasks/:taskId",
    [verifyToken, minimumRole("user")],
    updateUserTask
  );
}

export default UsersRouter;
