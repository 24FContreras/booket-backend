import { Router } from "express";
import { favoritesController } from "../controllers/favorites.controller.js";
import verificarToken from "../middlewares/verificarToken.js";

const favoritesRouter = Router();

favoritesRouter.get(
  "/favorites",
  verificarToken,
  favoritesController.obtenerFavoritos
);
favoritesRouter.post(
  "/favorites",
  verificarToken,
  favoritesController.agregarFavorito
);
favoritesRouter.delete(
  "/favorites",
  verificarToken,
  favoritesController.eliminarFavorito
);

export default favoritesRouter;
