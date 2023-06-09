import { config } from "dotenv";
config();
import jwt from "jsonwebtoken";

const verificarToken = (req, res, next) => {
  const Authorization = req.header("Authorization");
  const token = Authorization.split("Bearer ")[1];

  if (!token)
    throw {
      code: 401,
      message: "No has incluído un token",
    };

  const tokenValido = jwt.verify(token, process.env.JWKEY);

  if (!tokenValido)
    throw {
      code: 401,
      message: "El token ingresado no es válido",
    };

  next();
};

export default verificarToken;
