import { Router } from "express";
import { authenticate } from "../../middleware/auth";
import * as cartController from "./cart.controller";

const router = Router();

router.get("/", authenticate, cartController.getCart);
router.post("/", authenticate, cartController.addItem);
router.put("/:itemId", authenticate, cartController.updateItem);
router.delete("/:itemId", authenticate, cartController.removeItem);

export default router;
