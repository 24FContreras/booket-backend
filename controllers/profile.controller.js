import formidable from "formidable";
import fs from "fs";
import { helpers } from "../helpers/helpers.js";
import { profileModel } from "../models/profile.model.js";

const subirFotoPerfil = async (req, res) => {
  const form = formidable({ multiples: false });

  form.maxFileSize = 50 * 1024 * 1024;

  form.parse(req, async (err, fields, files) => {
    try {
      if (err) {
        throw new Error("Falló el servidor");
      }

      const { email } = fields;
      const file = files.image;
      const userID = await helpers.getUserID(email);

      //IMAGE UPLOADER
      const extension = file.mimetype.split("/")[1];
      const directory = new URL(
        `../public/images/avatars/${userID}.${extension}`,
        import.meta.url
      ).href;

      fs.renameSync(file.filepath, directory.split("///")[1]);

      //DATABASE REF
      profileModel.changeAvatar(userID, extension, userID);
    } catch (error) {
      console.log(error.message);
    }
  });
};

export const profileController = { subirFotoPerfil };
