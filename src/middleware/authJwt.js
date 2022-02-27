import jwt from "jsonwebtoken";
import authConfig from "../config/auth.config.js";
// Models
import db from "../models/index.js";
const { user: User } = db;
const { role: Role } = db;

const { TokenExpiredError } = jwt;

const catchError = (err, res) => {
  if (err instanceof TokenExpiredError) {
    return res
      .status(401)
      .json({ message: "Unauthorized! Access Token was expired!" });
  }

  return res.status(401).json({ message: "Unauthorized!" });
};

export const verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).json({ message: "No token provided!" });
  }

  jwt.verify(token, authConfig.secret, (err, decoded) => {
    if (err) {
      return catchError(err, res);
    }
    req.userId = decoded.id;
    next();
  });
};

export const minimumRole = (minRole) => {
  const middleware = async (req, res, next) => {
    const user = await User.getUserById(req.userId);
    // Check if user exist
    if (!user) return res.status(400).json({ err: "User doesn't exist" });

    const roles = await Role.getRoles(user.roles);

    for (let role of roles) {
      if (role.name === minRole) {
        return next();
      }
    }

    return res.status(403).json({ message: `Require ${minRole} role!` });
  };

  return middleware;
};

// export const isAdmin = (req, res, next) => {
//   User.findById(req.userId).exec((err, user) => {
//     if (err) {
//       res.status(500).send({ message: err });
//       return;
//     }

//     Role.find(
//       {
//         _id: { $in: user.roles },
//       },
//       (err, roles) => {
//         if (err) {
//           res.status(500).send({ message: err });
//           return;
//         }

//         for (let i = 0; i < roles.length; i++) {
//           if (roles[i].name === "admin") {
//             next();
//             return;
//           }
//         }

//         res.status(403).send({ message: "Require Admin Role!" });
//         return;
//       }
//     );
//   });
// };

// export const isModerator = (req, res, next) => {
//   User.findById(req.userId).exec((err, user) => {
//     if (err) {
//       res.status(500).send({ message: err });
//       return;
//     }

//     Role.find(
//       {
//         _id: { $in: user.roles },
//       },
//       (err, roles) => {
//         if (err) {
//           res.status(500).send({ message: err });
//           return;
//         }

//         for (let i = 0; i < roles.length; i++) {
//           if (roles[i].name === "moderator") {
//             next();
//             return;
//           }
//         }

//         res.status(403).send({ message: "Require Moderator Role!" });
//         return;
//       }
//     );
//   });
// };
