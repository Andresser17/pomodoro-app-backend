// Controllers
import { login, signUp, signIn } from "../controllers/auth.controller.js";
// Middleware
import {
  hasAuthValidFields,
  isPasswordAndUserMatch,
} from "../middleware/verifyUser.js";
import {
  validJWTNeeded,
  verifyRefreshBodyField,
  validRefreshNeeded,
} from "../middleware/authValidation.js";
import {
  checkDuplicateEmail,
  checkRolesExisted,
} from "../middleware/verifySignUp.js";

function AuthorizationRouter(app) {
  app.post("/auth", [hasAuthValidFields, isPasswordAndUserMatch, login]);

  app.post("/auth/refresh", [
    validJWTNeeded,
    verifyRefreshBodyField,
    validRefreshNeeded,
    login,
  ]);

  app.use((req, res, next) => {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/auth/signup",
    [
      checkDuplicateEmail,
      checkRolesExisted
    ],
    signUp
  );

  app.post("/api/auth/signin", signIn);
}

export default AuthorizationRouter;
