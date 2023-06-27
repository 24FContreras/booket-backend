import { config } from "dotenv";
config();
import express from "express";
import cors from "cors";

const app = express();

//ROUTERS
import authRouter from "./routes/auth.route.js";
import profileRouter from "./routes/profile.route.js";
import userRouter from "./routes/user.route.js";
import productsRouter from "./routes/products.route.v2.js";
import favoritesRouter from "./routes/favorites.route.js";
import testRouter from "./routes/test.route.js";

//MIDDLEWARE
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//ROUTES
app.use("/api", authRouter);
app.use("/api", profileRouter);
app.use("/api", userRouter);
app.use("/api", productsRouter);
app.use("/api", favoritesRouter);
app.use("/api", testRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, console.log("🟢 Servidor encendido en el puerto " + PORT));

export default app;
