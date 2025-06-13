import express from "express";
import {
  createCar,
  getCars,
  getCar,
  updateCar,
  deleteCar,
} from "../controllers/car.js"; 

import {
  createCarValidator,
  updateCarValidator,
} from "../validators/car.validator.js"; 

import upload from "../config/multer.js"; 

const router = express.Router();

router.post("/", upload.single("image"), createCarValidator, createCar);
router.get("/", getCars);
router.get("/:id", getCar);
router.put("/:id", upload.single("image"), updateCarValidator, updateCar);
router.delete("/:id", deleteCar);

export default router;
