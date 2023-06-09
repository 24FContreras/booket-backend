import { config } from "dotenv";
config();
import express from "express";
import cors from "cors";

const app = express();

//ROUTERS
import authRouter from "./routes/auth.route.js";
import profileRouter from "./routes/profile.route.js";
import userRouter from "./routes/user.route.js";
import productsRouter from "./routes/products.route.js";

//MIDDLEWARE
app.use(cors());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//ROUTES
app.use("/api", authRouter);
app.use("/api", profileRouter);
app.use("/api", userRouter);
app.use("/api", productsRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, console.log("🟢 Servidor encendido en el puerto " + PORT));
