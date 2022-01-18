import {
  hasAuthValidFields,
  isPasswordAndUserMatch,
} from "../middleware/verifyUser.js";
import { login } from "../controllers/auth.controller.js";
import {
  validJWTNeeded,
  verifyRefreshBodyField,
  validRefreshNeeded,
} from "../middleware/authValidation.js";

function AuthorizationRouter(app) {
  app.post("/auth", [hasAuthValidFields, isPasswordAndUserMatch, login]);

  app.post("/auth/refresh", [
    validJWTNeeded,
    verifyRefreshBodyField,
    validRefreshNeeded,
    login,
  ]);
}

export default AuthorizationRouter;
