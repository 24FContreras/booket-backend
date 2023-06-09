import { pool } from "../database/conexion.js";

//GET
const readAll = async () => {
  const consulta =
    "SELECT id, titulo, autor, editorial, paginas, estado, encuadernacion, portada, idioma, stock, precio, descripcion, vendedor, activo FROM productos";

  const { rows } = await pool.query(consulta);

  return rows;
};

//GET
const readSingle = async (id) => {
  const consulta =
    "SELECT titulo, autor, editorial, paginas, estado, encuadernacion, portada, idioma, stock, precio, descripcion, vendedor, activo FROM productos WHERE id = $1";

  const { rows } = await pool.query(consulta, [id]);

  return rows;
};

//POST CREATE
const create = async (detalles) => {
  const consulta =
    "INSERT INTO productos VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)";

  const {
    id,
    titulo,
    autor,
    editorial,
    paginas,
    estado,
    encuadernacion,
    portada,
    idioma,
    stock,
    precio,
    descripcion,
    vendedor,
  } = detalles;

  const values = [
    id,
    titulo,
    autor,
    editorial,
    paginas,
    estado,
    encuadernacion,
    portada,
    idioma,
    stock,
    precio,
    descripcion,
    vendedor,
    true,
  ];

  await pool.query(consulta, values);
};

export const productsModel = { readAll, readSingle, create };
