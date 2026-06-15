// import redisClient from "../config/redis.js";

// export default async function checkAuth(req, res, next) {
//   const { sid } = req.signedCookies;

//   if (!sid) {
//     res.clearCookie("sid");
//     return res.status(401).json({ error: "1 Not logged in!" });
//   }

//   const session = await redisClient.json.get(`session:${sid}`);

//   if (!session) {
//     res.clearCookie("sid");
//     return res.status(401).json({ error: "2 Not logged in!" });
//   }

//   req.user = { _id: session.sid, rootDirId: session.rootDirId };
//   next();
// }

// export const checkNotRegularUser = (req, res, next) => {
//   if (req.user.role !== "User") return next();
//   res.status(403).json({ error: "You can not access users" });
// };

// export const checkIsAdminUser = (req, res, next) => {
//   if (req.user.role === "Admin") return next();
//   res.status(403).json({ error: "You can not delete users" });
// };
// import User from "../models/userModel.js";

// export default async function checkAuth(req, res, next) {
// const { sid } = req.signedCookies

//   if (!sid) {
//     res.clearCookie("sid");
//     return res.status(401).json({
//       error: "Not logged in!",
//     });
//   }

//   const user = await User.findById(sid);

//   if (!user) {
//     res.clearCookie("sid");
//     return res.status(401).json({
//       error: "User not found!",
//     });
//   }

//   req.user = user;

//   next();
// }

// export const checkNotRegularUser = (req, res, next) => {
//   if (req.user.role !== "User") return next();

//   res.status(403).json({
//     error: "You can not access users",
//   });
// };

// export const checkIsAdminUser = (req, res, next) => {
//   if (req.user.role === "Admin") return next();

//   res.status(403).json({
//     error: "You can not delete users",
//   });
// };

import Session from "../models/sessionModel.js";
import User from "../models/userModel.js";

export default async function checkAuth(req, res, next) {
  const { sid } = req.signedCookies;

  if (!sid) {
    return res.status(401).json({
      error: "Not logged in",
    });
  }

  const session = await Session.findOne({ sid });

  if (!session) {
    return res.status(401).json({
      error: "Session expired",
    });
  }

  const user = await User.findById(session.userId);

  if (!user) {
    return res.status(401).json({
      error: "User not found",
    });
  }

  req.user = user;

  next();
}
export const checkNotRegularUser = (req, res, next) => {
  if (req.user.role !== "User") return next();

  res.status(403).json({
    error: "You can not access users",
  });
};

export const checkIsAdminUser = (req, res, next) => {
  if (req.user.role === "Admin") return next();

  res.status(403).json({
    error: "You can not delete users",
  });
};