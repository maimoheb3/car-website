import { body } from "express-validator";

const allowedCategories = [
  "Sedan",
  "SUV",
  "Truck",
  "Convertible",
  "Coupe",
  "Hatchback",
  "Electric",
  "Hybrid",
];

export const createCarValidator = [
  body("make").notEmpty().withMessage("Make is required"),
  body("model").notEmpty().withMessage("Model is required"),
  body("price")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),
  body("stock")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Stock must be a non-negative integer"),
  body("category")
    .notEmpty()
    .withMessage("Category is required")
    .isIn(allowedCategories)
    .withMessage(`Category must be one of: ${allowedCategories.join(", ")}`),
];

export const updateCarValidator = [
  body("make").optional().notEmpty().withMessage("Make cannot be empty"),
  body("model").optional().notEmpty().withMessage("Model cannot be empty"),
  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),
  body("stock")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Stock must be a non-negative integer"),
  body("category")
    .optional()
    .isIn(allowedCategories)
    .withMessage(`Category must be one of: ${allowedCategories.join(", ")}`),
];
