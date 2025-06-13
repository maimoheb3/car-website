import User from "../models/user.js";
import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Car from "../models/car.js";

// Create user
export const createUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).json({ errors: "Email is taken" });

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const newUser = new User({
      ...req.body,
      password: hashedPassword,
    });

    await newUser.save();
    const { password, ...userData } = newUser.toObject();
    res.status(201).json(userData);
  } catch (err) {
    res.status(500).json({ errors: err.message });
  }
};

// Login user
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select("+password");
    if (!user)
      return res.status(401).json({ errors: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ errors: "Invalid email or password" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.cookie("token", token, { httpOnly: true, secure: true });

    res.json({ message: "Logged in successfully", role: user.role });
  } catch (err) {
    console.log(err);
    res.status(500).json({ errors: err.message });
  }
};

// Get all users
export const getUsers = async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
};

// Get single user
export const getUser = async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
};

// Update user
export const updateUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json({ message: "User deleted" });
};

// Add to Cart (Cars)
export const addToCart = async (req, res) => {
  try {
    let { carId, quantity } = req.body;

    if (!carId) {
      return res.status(400).json({ error: "carId is required" });
    }

    quantity = parseInt(quantity, 10) || 1;
    if (quantity <= 0) {
      return res
        .status(400)
        .json({ error: "Quantity must be a positive number" });
    }

    const user = req.user;

    const car = await Car.findById(carId);
    if (!car) return res.status(404).json({ error: "Car not found" });

    const existingItem = user.cart.items.find((item) =>
      item.car.equals(carId)
    );

    if (existingItem) {
      existingItem.quantity += quantity;
      existingItem.price = car.price * existingItem.quantity;
    } else {
      user.cart.items.push({
        car: carId,
        quantity,
        price: car.price * quantity,
      });
    }

    user.cart.totalPrice = user.cart.items.reduce(
      (sum, item) => sum + item.price,
      0
    );

    await user.save();

    res.status(200).json({
      message: "Item added to cart successfully",
      cart: user.cart,
    });
  } catch (error) {
    console.error("Add to cart error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update Cart Item (Cars)
export const updateCartItem = async (req, res) => {
  try {
    const { carId } = req.params;
    const { btn_type } = req.body;

    const user = req.user;

    const itemIndex = user.cart.items.findIndex((item) =>
      item.car.equals(carId)
    );

    if (itemIndex === -1)
      return res.status(404).json({ error: "Item not found in cart" });

    const item = user.cart.items[itemIndex];

    if (btn_type === "plus") {
      item.quantity += 1;
      item.price = (item.price / (item.quantity - 1)) * item.quantity;
    } else if (btn_type === "minus") {
      item.quantity -= 1;
      if (item.quantity <= 0) {
        user.cart.items.splice(itemIndex, 1);
      } else {
        item.price = (item.price / (item.quantity + 1)) * item.quantity;
      }
    } else {
      return res.status(400).json({ error: "Invalid btn_type value" });
    }

    user.cart.totalPrice = user.cart.items.reduce(
      (total, item) => total + item.price,
      0
    );

    await user.save();

    res.status(200).json({ message: "Cart item updated", cart: user.cart });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating cart", error: err.message });
  }
};
