import Car from "../models/car.js"; // updated model import
import { validationResult } from "express-validator";

export const createCar = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    const carData = {
      ...req.body,
      image: req.file ? `/img/uploads/cars/${req.file.filename}` : null,
    };

    const car = await Car.create(carData);
    res.status(201).json(car);
  } catch (err) {
    console.error("Error creating car:", err);
    res.status(500).json({ message: err.message });
  }
};

export const getCars = async (req, res) => {
  const cars = await Car.find();
  res.json(cars);
};

export const getCar = async (req, res) => {
  const car = await Car.findById(req.params.id);
  if (!car) return res.status(404).json({ message: "Car not found" });
  res.json(car);
};

export const updateCar = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    const updateData = { ...req.body };

    if (req.file) {
      updateData.image = `/img/uploads/cars/${req.file.filename}`;
    }

    const car = await Car.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });
    if (!car) return res.status(404).json({ message: "Car not found" });
    res.json(car);
  } catch (err) {
    console.error("Error updating car:", err);
    res.status(500).json({ message: err.message });
  }
};

export const deleteCar = async (req, res) => {
  const car = await Car.findByIdAndDelete(req.params.id);
  if (!car) return res.status(404).json({ message: "Car not found" });
  res.json({ message: "Car deleted" });
};
