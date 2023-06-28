import { config } from "dotenv";
config();
import jwt from "jsonwebtoken";
import { userModel } from "../models/user.model.js";
import { amazonbucketHandler } from "../s3.js";

const getUser = async (req, res) => {
  try {
    const Authorization = req.header("Authorization");
    const token = Authorization.split("Bearer ")[1];

    const { email } = jwt.decode(token);

    const user = await userModel.getUser(email);

    await amazonbucketHandler.getAvatarAWS(user);

    return res.json(user);
  } catch (error) {
    res.status(error.code || 500).send(error.message);
  }
};

export const userController = { getUser };
