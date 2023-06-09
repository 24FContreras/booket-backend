import formidable from "formidable";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { productsModel } from "../models/products.model.js";
import { helpers } from "../helpers/helpers.js";

//OBTENER PUBLICACIONES
const obtenerPublicaciones = async (req, res) => {
  try {
    const data = await productsModel.readAll();
    return res.json(data);
  } catch (error) {
    res.status(error.code || 500).send(error);
  }
};

//OBTENER PUBLICACION INDIVIDUAL
const obtenerPublicacion = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await productsModel.readSingle(id);
    console.log(data);

    if (data.length === 0) {
      throw new Error("No existe este producto");
    }

    return res.json(data);
  } catch (error) {
    console.log(error);
    res.status(error.code || 500).send(error);
  }
};

//CREAR PUBLICACIÓN
const crearPublicacion = async (req, res) => {
  console.log(req.body);

  const form = formidable({ multiples: false });
  form.maxFileSize = 50 * 1024 * 1024;

  form.parse(req, async (err, fields, files) => {
    try {
      if (err) {
        throw new Error("Falló el servidor");
      }

      const bookid = uuidv4();
      const file = files.image;
      const userID = await helpers.getUserID(fields.vendedor);

      //IMAGE UPLOADER
      const extension = file.mimetype.split("/")[1];
      const directory = new URL(
        `../public/images/books/BO-${bookid}.${extension}`,
        import.meta.url
      ).href;

      fs.renameSync(file.filepath, directory.split("///")[1]);

      //DATABASE REF
      const detalles = {
        ...fields,
        portada: `BO-${bookid}.${extension}`,
        vendedor: userID,
        id: "BO-" + bookid,
      };

      if (Object.values(fields).some((item) => item.trim() === ""))
        throw new Error("Alguno de los campos fue enviado vacío");

      productsModel.create(detalles);

      res.send("Producto creado con éxito!");
    } catch (error) {
      console.log(error);
      res.status(error.code || 500).send(error);
    }
  });
};

export const productsController = {
  obtenerPublicaciones,
  obtenerPublicacion,
  crearPublicacion,
};
