import { config } from "dotenv";
config();
import jwt from "jsonwebtoken";
import { userModel } from "../models/user.model.js";

const getUser = async (req, res) => {
  try {
    const Authorization = req.header("Authorization");
    const token = Authorization.split("Bearer ")[1];
    jwt.verify(token, process.env.JWKEY);
    const { email } = jwt.decode(token);

    const user = await userModel.getUser(email);

    return res.json(user);
  } catch (error) {
    console.log(error);
    res.status(error.code || 500).send(error);
  }
};

export const userController = { getUser };
