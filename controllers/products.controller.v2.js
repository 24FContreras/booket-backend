import formidable from "formidable";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { productsModel } from "../models/products.model.js";
import { helpers } from "../helpers/helpers.js";
import jwt from "jsonwebtoken";

//OBTENER PUBLICACIONES
const obtenerPublicaciones = async (req, res) => {
  try {
    const data = await productsModel.readAllFiltered(req.query);
    return res.json(data);
  } catch (error) {
    res.status(error.code || 500).send(error);
  }
};

//OBTENER PUBLICACIONES FILTRADAS
const obtenerPublicacionesFiltradas = async (req, res) => {
  try {
    const data = await productsModel.readAll(req.query);
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
    const data = await productsModel.readSingle(id);

    const userID = await helpers.getUserID(email);

    if (data.length === 0) {
      throw { code: 404, message: "No existe este producto" };
    }

    if (userID.id !== data[0].vendedor) {
      throw new Error("Este producto no es del usuario registrado");
    }

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

    return res.json(data);
  } catch (error) {
    res.status(error.code || 500).send(error);
  }
};

//CREAR PUBLICACIÓN
const crearPublicacion = async (req, res) => {
  const Authorization = req.header("Authorization");
  const token = Authorization.split("Bearer ")[1];
  const { email } = jwt.decode(token);
  const userID = await helpers.getUserID(email);
  const bookID = uuidv4();

  productsModel.create({
    ...req.body,
    vendedor: userID.id,
    id: "BO-" + bookID,
    portada: `${req.file.filename}`,
  });

  res.json({ estado: "ok", message: "Publicación creada con éxito" });
};

//MODIFICAR PUBLICACIÓN
const modificarPublicacion = async (req, res) => {
  try {
    const { id } = req.params;

    productsModel.update({ ...req.body, id: id });

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
    const { image } = req.body;

    const path = "./public/images/books/" + image;

    fs.unlink(path, (err) => {
      if (err) throw err;
      console.log(`Se eliminó la imagen ubicada en ${path}`);
    });

    productsModel.remove(id);

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
