import app from "../index";
import request from "supertest";

describe("Testing rutas products", () => {
  it("GET: Ruta /products obtiene un status 200 al solicitar productos", async () => {
    const response = await request(app).get("/api/products").send();

    expect(response.statusCode).toBe(200);
  });

  it("GET: Ruta productos/:id obtiene un código 404 si no existe el producto", async () => {
    const response = await request(app).get("/api/products/noexisto").send();

    expect(response.statusCode).toBe(404);
  });

  it("GET: Ruta /products/userID devuelve un status 500 si no tiene token válido", async () => {
    const jwt = "Bearer tokennoexistente";

    const response = await request(app)
      .get("/api/products/user")
      .set("Authorization", jwt)
      .send();
    expect(response.statusCode).toBe(500);
  });
});

describe("Testing rutas Auth", () => {
  it("POST: Ruta /register devuelve un status 400 al intentar registrar un email ya existente", async () => {
    const response = await request(app).post("/api/register").send({
      email: "usuario1@gmail.com",
      password: "pass",
      username: "test1",
    });
    expect(response.statusCode).toBe(409);
  });

  it("POST: Ruta /login devuelve un status 401 hacer login con mail no registrado", async () => {
    const response = await request(app).post("/api/login").send({
      email: "correo40@gmail.com",
      password: "correo40",
    });
    expect(response.statusCode).toBe(401);
  });

  it("POST: Ruta /login devuelve un status 401 hacer login con credenciales equivocadas", async () => {
    const response = await request(app).post("/api/login").send({
      email: "correo1@gmail.com",
      password: "passincorrecta",
    });
    expect(response.statusCode).toBe(401);
  });
});
