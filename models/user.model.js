import { pool } from "../database/conexion.js";

const getUser = async (email) => {
  const consulta =
    "SELECT email, username, avatar, extension FROM usuarios WHERE email = $1";
  const { rows } = await pool.query(consulta, [email]);

  return rows;
};

export const userModel = { getUser };
