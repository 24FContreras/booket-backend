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

//GET ALL FROM ONE USER
const readFromUser = async (id) => {
  const consulta =
    "SELECT id, titulo, autor, editorial, paginas, estado, encuadernacion, portada, idioma, stock, precio, descripcion, vendedor, activo FROM productos WHERE vendedor = $1";

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

  return "Producto añadido con éxito";
};

//PUT UPDATE
const update = async (detalles) => {
  let counter = 0;

  const valoresArray = Object.values(detalles);
  const valores = [valoresArray[0], valoresArray[1], valoresArray[13]];

  //1titulo 2autor 3editorial 4paginas 5estado 6encuadernacion 7portada 8idioma 9stock 10precio 11descripcion 12vendedor 13activo 14id

  const consulta = "UPDATE productos SET titulo = $1, autor = $2 WHERE id = $3";

  await pool.query(consulta, valores);
  return "Esto es una prueba exitosa";
};

//DELETE
const remove = async (id) => {
  const consulta = "DELETE FROM productos WHERE id = $1";

  await pool.query(consulta, [id]);

  return "Removido con éxito";
};

export const productsModel = {
  readAll,
  readSingle,
  readFromUser,
  create,
  update,
  remove,
};
