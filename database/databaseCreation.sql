CREATE DATABASE booket;

CREATE TABLE usuarios(
	id VARCHAR(200) PRIMARY KEY,
	email VARCHAR(200) NOT NULL UNIQUE,
	username VARCHAR(100) NOT NULL UNIQUE,
	password VARCHAR(200) NOT NULL,
	avatar VARCHAR(200) DEFAULT 'default_avatar.png'
);

CREATE TABLE productos(
	id VARCHAR(200) PRIMARY KEY,
	titulo VARCHAR(200) NOT NULL,
	autor VARCHAR(100) NOT NULL,
	editorial VARCHAR(100) NOT NULL,
	paginas INT NOT NULL,
	estado VARCHAR(50) NOT NULL,
	encuadernacion VARCHAR (50) NOT NULL,
	portada VARCHAR(100) DEFAULT 'default_cover.png',
	idioma VARCHAR(50),
	stock INT,
	precio INT,
	descripcion TEXT DEFAULT 'Sin descripción',
	vendedor VARCHAR(200),
	activo BOOLEAN DEFAULT 'true',
	fecha DATE DEFAULT CURRENT_DATE,
	CONSTRAINT key_usuario FOREIGN KEY(vendedor) REFERENCES usuarios(id)
);

CREATE TABLE favoritos(
	id SERIAL PRIMARY KEY,
	id_usuario VARCHAR(200) NOT NULL,
	id_producto VARCHAR(200) NOT NULL,
	CONSTRAINT key_usuario FOREIGN KEY(id_usuario) REFERENCES usuarios(id),
	CONSTRAINT key_producto FOREIGN KEY(id_producto) REFERENCES productos(id)
)

CREATE TABLE pagos(
	id SERIAL PRIMARY KEY,
	pedido VARCHAR(200) NOT NULL,
	fecha DATE DEFAULT CURRENT_DATE,
	vendedor VARCHAR(200) NOT NULL,
	comprador VARCHAR(200) NOT NULL,
	producto VARCHAR(200) NOT NULL,
	cantidad INT NOT NULL,
	CONSTRAINT key_vendedor FOREIGN KEY(vendedor) REFERENCES usuarios(id),
	CONSTRAINT key_comprador FOREIGN KEY(comprador) REFERENCES usuarios(id),
	CONSTRAINT key_producto FOREIGN KEY(producto) REFERENCES productos(id)
)