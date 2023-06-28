import { Router } from "express";
import multer from "multer";
import { profileController } from "../controllers/profile.controller.v2.js";
import verificarToken from "../middlewares/verificarToken.js";

const profileRouter = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

profileRouter.post(
  "/profile",
  verificarToken,
  upload.single("image"),
  profileController.subirFotoPerfil
);

export default profileRouter;
