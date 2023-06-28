import { profileModel } from "../models/profile.model.js";
import { amazonbucketHandler } from "../s3.js";
import { helpers } from "../helpers/helpers.js";

const subirFotoPerfil = async (req, res) => {
  const userID = await helpers.getUserID(req.body.email);
  const extension = req.file.mimetype.split("/")[1];
  const newName = `${userID.id}.${extension}`;

  try {
    profileModel.changeAvatar(newName, userID.id);

    await amazonbucketHandler.uploadAvatarAWS(req.file, userID.id);

    res.send("Cambio exitoso!");
  } catch (error) {
    console.log(error);
    res.status(error.code || 500).send(error);
  }
};

export const profileController = { subirFotoPerfil };
