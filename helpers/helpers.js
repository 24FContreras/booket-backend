import { pool } from "../database/conexion.js";

const getUserID = async (email) => {
  const consulta = "SELECT id FROM usuarios WHERE email = $1";
  const values = [email];
  const { rows } = await pool.query(consulta, values);

  return rows[0].id;
};

export const helpers = { getUserID };
