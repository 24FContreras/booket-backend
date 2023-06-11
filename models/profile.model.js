import { pool } from "../database/conexion.js";

//POST IMAGEN DE PERFIL
const changeAvatar = async (avatar, id) => {
  const consulta = "UPDATE usuarios SET avatar = $1 WHERE id = $2";
  const values = [avatar, id];
  await pool.query(consulta, values);
};

export const profileModel = { changeAvatar };
