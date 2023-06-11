import { Router } from "express";
import multer from "multer";
import { profileController } from "../controllers/profile.controller.v2.js";
import verificarToken from "../middlewares/verificarToken.js";
import { helpers } from "../helpers/helpers.js";

const profileRouter = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images/avatars/");
  },
  filename: async (req, file, cb) => {
    const userID = await helpers.getUserID(req.body.email);
    const extension = file.mimetype.split("/")[1];
    const newName = `${userID.id}.${extension}`;

    cb(null, newName);
  },
});

const upload = multer({ storage: storage });

profileRouter.post(
  "/profile",
  verificarToken,
  upload.single("image"),
  profileController.subirFotoPerfil
);

export default profileRouter;
