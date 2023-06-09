import { Router } from "express";
import { profileController } from "../controllers/profile.controller.js";
import verificarToken from "../middlewares/verificarToken.js";

const profileRouter = Router();

profileRouter.post(
  "/profile",
  verificarToken,
  profileController.subirFotoPerfil
);

export default profileRouter;
