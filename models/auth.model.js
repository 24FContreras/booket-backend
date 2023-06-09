import { pool } from "../database/conexion.js";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

//POST REGISTER
const register = async (email, username, password) => {
  const encryptedPW = bcrypt.hashSync(password);
  password = encryptedPW;
  const id = uuidv4();

  const consulta =
    "INSERT INTO usuarios VALUES($1, $2, $3, $4, 'default_avatar')";
  const values = [id, email, username, encryptedPW];
  await pool.query(consulta, values);
};

const authenticate = async (email, password) => {
  const consulta = "SELECT * FROM usuarios WHERE email = $1";
  const values = [email];
  const {
    rows: [usuario],
    rowCount,
  } = await pool.query(consulta, values);

  const { password: encrypted } = usuario;

  const passwordEsCorrecta = bcrypt.compareSync(password, encrypted);

  if (!passwordEsCorrecta || !rowCount)
    throw { code: 401, message: "Email o contraseña incorrecta" };
};

export const authModel = { authenticate, register };
