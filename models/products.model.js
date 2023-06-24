import { pool } from "../database/conexion.js";
import format from "pg-format";

//GET
const readAll = async ({ search = "titulo_", limits = 6, page = 1 }) => {
  let [field, value] = search.split("_");

  const offset = (page - 1) * limits;

  const consultaFormateada = format(
    "SELECT id, titulo, autor, editorial, paginas, estado, encuadernacion, portada, idioma, stock, precio, descripcion, vendedor, activo, fecha FROM productos WHERE %s ILIKE '%' || '%s' || '%' AND activo = 'true' ORDER BY titulo ASC LIMIT %s OFFSET %s",
    field,
    value,
    limits,
    offset
  );

  const { rows } = await pool.query(consultaFormateada);
  const { rowCount } = await pool.query(
    "SELECT * FROM productos WHERE activo = 'true'"
  );

  console.log(rowCount);

  return rows;
};

const readAllV2 = async ({ search = "titulo_", limits = 6, page = 1 }) => {
  let [field, value] = search.split("_");

  const offset = (page - 1) * limits;

  const consultaFormateada = format(
    "SELECT id, titulo, autor, editorial, paginas, estado, encuadernacion, portada, idioma, stock, precio, descripcion, vendedor, activo, fecha FROM productos WHERE %s ILIKE '%' || '%s' || '%' AND activo = 'true' ORDER BY titulo ASC LIMIT %s OFFSET %s",
    field,
    value,
    limits,
    offset
  );

  const queryCantidad = format(
    "SELECT * FROM productos WHERE %s ILIKE '%' || '%s' || '%' AND activo = 'true'",
    field,
    value
  );

  const { rows } = await pool.query(consultaFormateada);
  const { rowCount } = await pool.query(queryCantidad);

  return {
    total: rowCount,
    paginas: Math.ceil(rowCount / limits),
    productos: rows,
  };
};

//GET FILTERED
const readAllFiltered = async ({
  search = "titulo_",
  limits = 6,
  page = 1,
  preciomin,
  preciomax,
}) => {
  let [field, value] = search.split("_");
  const offset = (page - 1) * limits;

  const filterValues = [];
  const filterKeys = [];

  if (preciomin) {
    filterValues.push(`precio >= %s`);
    filterKeys.push(preciomin);
  }

  if (preciomax) {
    filterValues.push(`precio <= %s`);
    filterKeys.push(preciomin);
  }

  const consultaStart =
    "SELECT id, titulo, autor, editorial, paginas, estado, encuadernacion, portada, idioma, stock, precio, descripcion, vendedor, activo, fecha FROM productos WHERE %s ILIKE '%' || '%s' || '%' AND activo = 'true'";

  const consultaEnd = " ORDER BY titulo ASC LIMIT %s OFFSET %s";

  let consulta = "";

  if (filterValues.length) {
    consulta =
      consultaStart + " AND " + filterValues.join(" AND ") + consultaEnd;
  } else consulta = consultaStart + consultaEnd;

  const consultaFormateada = format(
    consulta,
    field,
    value,
    ...filterKeys,
    limits,
    offset
  );

  const { rows } = await pool.query(consultaFormateada);

  return rows;
};

//GET
const readSingle = async (id) => {
  const consulta =
    "SELECT titulo, autor, editorial, paginas, estado, encuadernacion, portada, idioma, stock, precio, descripcion, usuarios.username AS username, vendedor, activo FROM productos LEFT JOIN usuarios ON usuarios.id = productos.vendedor WHERE productos.id = $1";

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
const update = async (detalles, id) => {
  const keysDetalles = Object.keys(detalles);
  const valoresArray = Object.values(detalles);

  const queryData = keysDetalles.join(` = '%s', `);

  let consultaInicial = "UPDATE productos SET ";
  let consultaTail = " = '%s' WHERE id = '%s' RETURNING *";

  let consultaFinal = consultaInicial + queryData + consultaTail;

  let consultaFormateada = format(consultaFinal, ...valoresArray, id);

  await pool.query(consultaFormateada);
};

//DELETE
const remove = async (id) => {
  const consulta = "DELETE FROM productos WHERE id = $1";

  await pool.query(consulta, [id]);

  return "Removido con éxito";
};

export const productsModel = {
  readAll,
  readAllV2,
  readAllFiltered,
  readSingle,
  readFromUser,
  create,
  update,
  remove,
};
