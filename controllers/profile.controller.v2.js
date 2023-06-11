import { helpers } from "../helpers/helpers.js";
import { profileModel } from "../models/profile.model.js";

const subirFotoPerfil = async (req, res) => {
  try {
    //DATABASE REF
    profileModel.changeAvatar(
      req.file.filename,
      req.file.filename.split(".")[0]
    );

    res.send("Cambio exitoso!");
  } catch (error) {
    console.log(error);
    res.status(error.code || 500).send(error);
  }
};

export const profileController = { subirFotoPerfil };
