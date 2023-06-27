import { pool } from "../database/conexion.js";

//POST IMAGEN DE PERFIL
const sendImage = async (img) => {
  const consulta = "INSERT INTO test VALUES($1)";
  const values = [img];
  await pool.query(consulta, values);
};

export const testModel = { sendImage };
