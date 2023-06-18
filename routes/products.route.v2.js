import { Router } from "express";
import multer from "multer";
import { productsController } from "../controllers/products.controller.v2.js";
import verificarToken from "../middlewares/verificarToken.js";
import { helpers } from "../helpers/helpers.js";

const productsRouter = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file) {
      cb(null, "./public/images/books/");
    }
  },
  filename: async (req, file, cb) => {
    if (file) {
      const userID = await helpers.getUserID(req.body.email);
      const extension = file.mimetype.split("/")[1];
      const newName = `${Date.now()}.${extension}`;

      cb(null, newName);
    }
  },
});

const upload = multer({ storage: storage });

productsRouter.get("/products", productsController.obtenerPublicaciones);

productsRouter.get(
  "/products/search",
  productsController.obtenerPublicacionesFiltradas
);

productsRouter.get(
  "/products/user",
  productsController.obtenerPublicacionesUsuario
);
productsRouter.get("/products/:id", productsController.obtenerPublicacion);

//GET PRODUCT OF LOGGED USER FOR EDIT
productsRouter.get(
  "/products/edit/:id",
  verificarToken,
  productsController.obtenerPublicacionPropia
);

productsRouter.post(
  "/products",
  verificarToken,
  upload.single("image"),
  productsController.crearPublicacion
);

productsRouter.put(
  "/products/edit/:id",
  verificarToken,
  upload.none(),
  productsController.modificarPublicacion
);

productsRouter.delete(
  "/products/:id",
  verificarToken,
  upload.none(),
  productsController.eliminarPublicacion
);

export default productsRouter;
