import { Router } from "express";
import { favoritesController } from "../controllers/favorites.controller.js";

const favoritesRouter = Router();

favoritesRouter.get("/favorites", favoritesController.obtenerFavoritos);
favoritesRouter.post("/favorites", favoritesController.agregarFavorito);
favoritesRouter.delete("/favorites", favoritesController.eliminarFavorito);

export default favoritesRouter;
