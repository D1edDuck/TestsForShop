import { Router } from "express";
import { authenticate, authorize } from "../../middleware/auth";
import * as productsController from "./products.controller";

const router = Router();

router.get("/", productsController.list);
router.get("/categories", productsController.categories);
router.get("/:id", productsController.getById);
router.post("/", authenticate, authorize("ADMIN"), productsController.create);
router.put("/:id", authenticate, authorize("ADMIN"), productsController.update);
router.delete("/:id", authenticate, authorize("ADMIN"), productsController.remove);

export default router;
