import { config } from "dotenv";
config();
import jwt from "jsonwebtoken";
import { authModel } from "../models/auth.model.js";

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    await authModel.authenticate(email, password);
    const token = jwt.sign({ email }, process.env.JWKEY);
    res.send(token);
  } catch (error) {
    res.status(error.code || 500).send(error);
  }
};

const register = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    if (!email || !password || !username)
      throw new Error("Debes rellenar todos los campos");

    await authModel.register(email, username, password);
    res.send("Usuario creado correctamente");
  } catch (error) {
    res.status(error.code || 500).send(error);
  }
};

export const authController = { login, register };
