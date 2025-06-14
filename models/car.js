import mongoose from "mongoose";

const carSchema = new mongoose.Schema(
  {
    make: {
      type: String,
      required: [true, "Make is required"],
      trim: true,
      minLength: [1, "Make must not be empty"],
      maxLength: [100, "Make must be under 100 characters"],
    },
    model: {
      type: String,
      trim: true,
      required: [true, "Model is required"],
      maxLength: [100, "Model name too long"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price must be a positive number"],
    },
    stock: {
      type: Number,
      default: 0,
      min: [0, "Stock can't be negative"],
      validate: {
        validator: Number.isInteger,
        message: "Stock must be an integer",
      },
    },
    description: {
      type: String,
      maxLength: [1000, "Description too long"],
    },
    image: {
      type: String,
      validate: {
        validator: (v) =>
          !v ||
          /^(\/img\/uploads\/cars\/[\w-]+\.(jpg|gif|png|jpeg)$)|(^https?:\/\/.+\.(jpg|gif|png|jpeg)$)/i.test(
            v
          ),
        message:
          "Image must be a valid path or URL ending in .jpg, .png, .gif, or .jpeg",
      },
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: {
        values: [
          "Sedan",
          "SUV",
          "Truck",
          "Convertible",
          "Coupe",
          "Hatchback",
          "Electric",
          "Hybrid",
        ],
        message:
          "Category must be one of Sedan, SUV, Truck, Convertible, Coupe, Hatchback, Electric, Hybrid",
      },
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Car", carSchema);
