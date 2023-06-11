import { config } from "dotenv";
config();
import jwt from "jsonwebtoken";
import { helpers } from "../helpers/helpers.js";
import { favoritesModel } from "../models/favorites.model.js";

const agregarFavorito = async (req, res) => {
  try {
    const Authorization = req.header("Authorization");
    const token = Authorization.split("Bearer ")[1];
    const { email } = jwt.decode(token);
    const { productID } = req.body;
    const userId = await helpers.getUserID(email);

    await favoritesModel.add(userId.id, productID);

    return res.send("Funcionó");
  } catch (error) {
    console.log(error);
    res.status(error.code || 500).send(error);
  }
};

const obtenerFavoritos = async (req, res) => {
  try {
    const Authorization = req.header("Authorization");
    const token = Authorization.split("Bearer ")[1];
    const { email } = jwt.decode(token);
    const userId = await helpers.getUserID(email);

    const data = await favoritesModel.getFromUser(userId.id);

    return res.json(data);
  } catch (error) {
    console.log(error);
    res.status(error.code || 500).send(error);
  }
};

const eliminarFavorito = async (req, res) => {
  try {
    const Authorization = req.header("Authorization");
    const token = Authorization.split("Bearer ")[1];
    const { email } = jwt.decode(token);
    const { productID } = req.body;
    const userId = await helpers.getUserID(email);

    const data = await favoritesModel.eraseFromUser(userId.id, productID);

    return res.json(data);
  } catch (error) {
    console.log(error);
    res.status(error.code || 500).send(error);
  }
};

export const favoritesController = {
  agregarFavorito,
  obtenerFavoritos,
  eliminarFavorito,
};
