import { v4 as uuidv4 } from "uuid";
import { productsModel } from "../models/products.model.js";
import { helpers } from "../helpers/helpers.js";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import { amazonbucketHandler } from "../s3.js";

//OBTENER PUBLICACIONES
const obtenerPublicaciones = async (req, res) => {
  try {
    const data = await productsModel.readAllV2(req.query);

    await amazonbucketHandler.readFilesSWS(data.productos);

    return res.json(data);
  } catch (error) {
    res.status(error.code || 500).send(error);
  }
};

//OBTENER PUBLICACIONES FILTRADAS
const obtenerPublicacionesFiltradas = async (req, res) => {
  try {
    const data = await productsModel.readAllV2(req.query);

    await amazonbucketHandler.readFilesSWS(data.productos);

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

    await amazonbucketHandler.readFilesSWS(data);

    if (data.length === 0) {
      throw { code: 404, message: "No existe este producto" };
    }

    return res.json(data);
  } catch (error) {
    console.log(error);
    res.status(error.code || 500).send(error);
  }
};

//OBTENER PUBLICACION DE USUARIO LOGGEADO
const obtenerPublicacionPropia = async (req, res) => {
  try {
    const Authorization = req.header("Authorization");
    const { id } = req.params;

    const token = Authorization.split("Bearer ")[1];
    const { email } = jwt.decode(token);
    const data = await productsModel.readSingleForUser(id);

    const userID = await helpers.getUserID(email);

    if (data.length === 0) {
      throw { code: 404, message: "No existe este producto" };
    }

    if (userID.id !== data[0].vendedor) {
      throw new Error("Este producto no es del usuario registrado");
    }

    await amazonbucketHandler.readFilesSWS(data);

    return res.json(data);
  } catch (error) {
    console.log(error);
    res.status(error.code || 500).send(error.message);
  }
};

//OBTENER PUBLICACIONES DE UN USUARIO
const obtenerPublicacionesUsuario = async (req, res) => {
  try {
    const Authorization = req.header("Authorization");
    const token = Authorization.split("Bearer ")[1];
    const { email } = jwt.decode(token);

    const userID = await helpers.getUserID(email);
    const data = await productsModel.readFromUser(userID.id);

    await amazonbucketHandler.readFilesSWS(data);

    return res.json(data);
  } catch (error) {
    res.status(error.code || 500).send(error);
  }
};

//CREAR PUBLICACIÓN
const crearPublicacion = async (req, res) => {
  try {
    const Authorization = req.header("Authorization");
    const token = Authorization.split("Bearer ")[1];
    const { email } = jwt.decode(token);
    const userID = await helpers.getUserID(email);
    const bookID = uuidv4();

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      if (!req.file) {
        errors.errors.push({
          type: "field",
          msg: "Debes subir una imagen",
          path: "cover",
          location: "file",
        });
      }

      return res.json(errors);
    }

    const extension = req.file.mimetype.split("/")[1];
    const newFilename = Date.now();

    await productsModel.create({
      ...req.body,
      vendedor: userID.id,
      id: "BO-" + bookID,
      portada: `${newFilename}.${extension}`,
    });

    await amazonbucketHandler.uploadfileAWS(req.file, newFilename);

    res.json({ estado: "ok", message: "Publicación creada con éxito" });
  } catch (err) {
    console.log(err);
    res.json(err);
  }
};

//MODIFICAR PUBLICACIÓN
const modificarPublicacion = async (req, res) => {
  try {
    const { id } = req.params;

    await productsModel.update(req.body, id);

    res.json({ estado: "ok", message: "Publicación modificada con éxito" });
  } catch (error) {
    console.log(error);
    res.status(error.code || 500).send(error);
  }
};

//ELIMINAR PUBLICACIÓN
const eliminarPublicacion = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedItem = await productsModel.remove(id);

    await amazonbucketHandler.deleteFilesAWS(deletedItem);

    res.json({ estado: "ok", message: "Publicación eliminada con éxito" });
  } catch (error) {
    console.log(error);
    res.status(error.code || 500).send(error);
  }
};

export const productsController = {
  obtenerPublicaciones,
  obtenerPublicacionesFiltradas,
  obtenerPublicacion,
  obtenerPublicacionesUsuario,
  obtenerPublicacionPropia,
  crearPublicacion,
  modificarPublicacion,
  eliminarPublicacion,
};
