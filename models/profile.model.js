import { pool } from "../database/conexion.js";

//POST IMAGEN DE PERFIL
const changeAvatar = async (avatar, extension, id) => {
  const consulta =
    "UPDATE usuarios SET avatar = $1, extension = $2 WHERE id = $3";
  const values = [avatar, extension, id];
  await pool.query(consulta, values);
};

export const profileModel = { changeAvatar };
