import { Router } from "express";
import { userController } from "../controllers/user.controller.js";
import verificarToken from "../middlewares/verificarToken.js";

const userRouter = Router();

userRouter.get("/user", verificarToken, userController.getUser);

export default userRouter;
