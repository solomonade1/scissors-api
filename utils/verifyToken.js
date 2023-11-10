import jwt from "jsonwebtoken";
import { createError } from "../utils/createError.js";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return next(createError(401, "You are not authenticated!"));
  }

  jwt.verify(token, process.env.JWT, (err, user) => {
    if (err) return next(createError(403, "Token is not valid!"));
    req.user = user;
    next();
  });
};

export const verify = (req, res, next) => {
  const token = req.headers.cookie
  if(!token) res.status(403).json({ error: "please provide a token" })
  else {
      jwt.verify(token.split("=")[1], tokenSecret, (err, value) => {
          if(err) res.status(500).json({error: "failed to authenticate token"})
          req.user = value.data
          next()
       })
  }
}
export const verifyUser = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      return next(createError(403, "You are not authorized!"));
    }
  });
};
export const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    // console.log(req.user.isAdmin)
    if (req.user.isAdmin) {
      next();
    } else {
      return next(createError(403, "You are not authorized!"));
    }
  });
};
