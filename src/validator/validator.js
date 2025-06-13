import { body } from "express-validator";
export const userRegValidator = () => {
  return [
    body("username")
      .notEmpty()
      .withMessage("Username is required")
      .trim()
      .isLength({ min: 3, max: 30 })
      .withMessage("Username must be between 3 and 30 characters")
      .matches(/^[a-zA-Z0-9_]+$/)
      .withMessage(
        "Username can only contain letters, numbers, and underscores"
      )
      .custom((value) => {
        const reservedUsernames = ["admin", "user", "moderator", "system"];
        if (reservedUsernames.includes(value.toLowerCase())) {
          throw new Error("This username is reserved");
        }
        return true;
      }),

    body("fullName")
      .notEmpty()
      .withMessage("Full name is required")
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage("Full name must be between 2 and 50 characters")
      .matches(/^[a-zA-Z\s]+$/)
      .withMessage("Full name can only contain letters and spaces"),

    body("password")
      .trim()
      .notEmpty()
      .withMessage("All fields are required")
      .isLength({ min: 6 })
      .withMessage("Password must be greater than 6 characters")
      .matches(/[A-Z]/)
      .withMessage("Password must contain at least one uppercase letter")
      .matches(/[a-z]/)
      .withMessage("Password must contain at least one lowercase letter")
      .matches(/[0-9]/)
      .withMessage("Password must contain at least one number")
      .matches(/[!@#$%^&*(),.?":{}|<>]/)
      .withMessage("Password must contain at least one special character"),
  ];
};

export const loginValidator = () => {
  return [
    body("email")
      .notEmpty()
      .withMessage("All fields are required")
      .isEmail()
      .withMessage("Please enter a valid email address"),

    body("password")
      .trim()
      .notEmpty()
      .withMessage("All fields are required")
      .isLength({ min: 6 })
      .withMessage("Password must be greater than 6 characters")
      .matches(/[A-Z]/)
      .withMessage("Password must contain at least one uppercase letter")
      .matches(/[a-z]/)
      .withMessage("Password must contain at least one lowercase letter")
      .matches(/[0-9]/)
      .withMessage("Password must contain at least one number")
      .matches(/[!@#$%^&*(),.?":{}|<>]/)
      .withMessage("Password must contain at least one special character"),
  ];
};

export const currentPasswordValidator = () => {
  return [
    body("oldPassword")
      .trim()
      .notEmpty()
      .withMessage("All fields are required")
      .isLength({ min: 6 })
      .withMessage("Password must be greater than 6 characters")
      .matches(/[A-Z]/)
      .withMessage("Password must contain at least one uppercase letter")
      .matches(/[a-z]/)
      .withMessage("Password must contain at least one lowercase letter")
      .matches(/[0-9]/)
      .withMessage("Password must contain at least one number")
      .matches(/[!@#$%^&*(),.?":{}|<>]/)
      .withMessage("Password must contain at least one special character"),

    body("newPassword")
      .trim()
      .notEmpty()
      .withMessage("All fields are required")
      .isLength({ min: 6 })
      .withMessage("Password must be greater than 6 characters")
      .matches(/[A-Z]/)
      .withMessage("Password must contain at least one uppercase letter")
      .matches(/[a-z]/)
      .withMessage("Password must contain at least one lowercase letter")
      .matches(/[0-9]/)
      .withMessage("Password must contain at least one number")
      .matches(/[!@#$%^&*(),.?":{}|<>]/)
      .withMessage("Password must contain at least one special character"),
  ];
};
