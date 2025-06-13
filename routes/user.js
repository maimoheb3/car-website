import express from "express";
import {
  createUser,
  loginUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  addToCart,
  updateCartItem,
} from "../controllers/user.js";
import {
  createUserValidator,
  updateUserValidator,
} from "../validators/user.validator.js";

import auth from "../middlewares/auth.js";

const router = express.Router();

router.post("/cart", auth(["user"]), addToCart);
router.put("/cart/:carId", auth(["user"]), updateCartItem);

// Auth routes
router.post("/signup", createUserValidator, createUser);
router.post("/login", loginUser);
router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
});

// Admin/user management
router.get("/", getUsers);
router.get("/:id", getUser);
router.put("/:id", updateUserValidator, updateUser);
router.delete("/:id", deleteUser);

export default router;
