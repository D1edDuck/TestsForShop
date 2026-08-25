import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./modules/auth/auth.routes";
import productRoutes from "./modules/products/products.routes";
import cartRoutes from "./modules/cart/cart.routes";
import orderRoutes from "./modules/orders/orders.routes";
import adminRoutes from "./modules/admin/admin.routes";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use((_req, res) => {
  res.status(404).json({ error: "Endpoint не найден" });
});

app.use(errorHandler);

export default app;
