import { Router } from "express";
import { authController } from "../controllers/auth.controller.js";
import { body } from "express-validator";

//email, password

const authRouter = Router();

authRouter.post(
  "/login",
  [
    body("email", "Ingrese un email válido").trim().isEmail().normalizeEmail(),
    body("password", "Ingrese una contraseña válida")
      .trim()
      .notEmpty()
      .escape(),
  ],
  authController.login
);
authRouter.post(
  "/register",
  [
    body("email", "Ingrese un email válido").trim().isEmail().normalizeEmail(),
    body("password", "Ingrese una contraseña válida")
      .trim()
      .notEmpty()
      .escape(),
    body("username", "Ingrese un usuario válido").trim().notEmpty().escape(),
  ],
  authController.register
);

export default authRouter;
