import express from "express";
import {
  createOrder,
  getOrders,
  getOrder,
  updateOrderStatus,
  deleteOrder,
} from "../controllers/order.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

router.post("/", auth(["user"]), createOrder);
router.get("/", getOrders);
router.get("/:id", getOrder);
router.put("/:id/status", updateOrderStatus);
router.delete("/:id", deleteOrder);

export default router;
