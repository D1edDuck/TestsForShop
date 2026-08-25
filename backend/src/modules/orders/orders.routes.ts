import { Router } from "express";
import { authenticate } from "../../middleware/auth";
import * as ordersController from "./orders.controller";

const router = Router();

router.post("/", authenticate, ordersController.create);
router.get("/", authenticate, ordersController.list);
router.get("/:id", authenticate, ordersController.getById);
router.patch("/:id/status", authenticate, ordersController.updateStatus);

export default router;
