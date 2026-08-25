import app from "./app";
import { config } from "./config";

app.listen(config.port, () => {
  console.log(`TechShop API running on http://localhost:${config.port}`);
});
