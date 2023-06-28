import { pool } from "../database/conexion.js";
import { helpers } from "../helpers/helpers.js";

const getUser = async (email) => {
  const consultaUsuario =
    "SELECT email, username, avatar FROM usuarios WHERE email = $1";
  const { rows: usuario } = await pool.query(consultaUsuario, [email]);

  const userID = await helpers.getUserID(email);

  const consultaFavs =
    "SELECT id_producto FROM favoritos WHERE id_usuario = $1";

  const { rows: favoritos } = await pool.query(consultaFavs, [userID.id]);

  return { ...usuario[0], favorites: favoritos };
};

export const userModel = { getUser };
