import { Router } from "express";
import { authenticate, authorize } from "../../middleware/auth";
import * as adminController from "./admin.controller";

const router = Router();

router.get("/stats", authenticate, authorize("ADMIN"), adminController.stats);
router.get("/users", authenticate, authorize("ADMIN"), adminController.users);
router.get("/orders", authenticate, authorize("ADMIN"), adminController.orders);

export default router;
