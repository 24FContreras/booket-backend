import { pool } from "../database/conexion.js";
import { amazonbucketHandler } from "../s3.js";

const add = async (userID, productID) => {
  const consulta =
    "INSERT INTO favoritos(id_usuario, id_producto) VALUES($1, $2)";
  await pool.query(consulta, [userID, productID]);

  return "Favorito ha sido añadido";
};

const getFromUser = async (userID) => {
  const consulta =
    "SELECT productos.id AS id, titulo, autor, portada, estado, editorial FROM favoritos INNER JOIN productos ON favoritos.id_producto = productos.id WHERE id_usuario = $1";

  const { rows } = await pool.query(consulta, [userID]);

  await amazonbucketHandler.readFilesSWS(rows);

  return rows;
};

const eraseFromUser = async (userId, productId) => {
  const consulta =
    "DELETE FROM favoritos WHERE id_usuario = $1 AND id_producto = $2";

  await pool.query(consulta, [userId, productId]);

  return true;
};

export const favoritesModel = { add, getFromUser, eraseFromUser };
