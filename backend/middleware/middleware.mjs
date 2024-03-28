import { body, param, validationResult }  from "express-validator";

export function sanitizeUserCredential(req, res, next) {
  body("username").notEmpty().escape();
  body("password").notEmpty().escape();
  next();
}

export function sanitizeFileInfo(req, res, next) {
  body("path").notEmpty().escape();
  body("last_modified").notEmpty().escape();
  next();
}

export function isAuthenticated(req, res, next) {
  if (!req.session.username) return res.status(401).end("access denied");
  next();
}