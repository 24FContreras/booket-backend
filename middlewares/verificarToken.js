import { config } from "dotenv";
config();
import jwt from "jsonwebtoken";

const verificarToken = (req, res, next) => {
  const Authorization = req.header("Authorization");

  try {
    if (!Authorization)
      throw {
        code: 401,
        message: "No has incluído un token",
      };

    const token = Authorization.split("Bearer ")[1];

    if (!token)
      throw {
        code: 401,
        message: "No has incluído un token",
      };

    const tokenValido = jwt.verify(token, process.env.JWKEY, (err) => {
      if (err)
        throw {
          code: 401,
          message: "El token ingresado no es válido",
        };
    });

    next();
  } catch (error) {
    res.json(error);
  }
};

export default verificarToken;
