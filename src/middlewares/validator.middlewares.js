import { validationResult } from "express-validator";

export const validatorError = (req, res, next) => {
  const errors = validationResult(req).array();
  if (errors.length == 0) {
    return next();
  }
  console.log("user verification error : ", errors);
  const arrayOfErrors = [];
  errors.forEach((err) => {
    arrayOfErrors.push({ message: err.message, location: err.location });
  });
};
