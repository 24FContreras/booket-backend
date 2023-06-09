import { Router } from "express";
import { productsController } from "../controllers/products.controller.js";
import verificarToken from "../middlewares/verificarToken.js";

const productsRouter = Router();

productsRouter.get("/products", productsController.obtenerPublicaciones);
productsRouter.get("/products/:id", productsController.obtenerPublicacion);
productsRouter.post(
  "/products",
  verificarToken,
  productsController.crearPublicacion
);

export default productsRouter;
