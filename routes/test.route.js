import { Router } from "express";
import multer from "multer";
import { amazonbucketHandler } from "../s3.js";
import { testModel } from "../models/test.model.js";

const testRouter = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

testRouter.get(
  "/test",

  (req, res) => {
    res.send("funciona");
  }
);

testRouter.post(
  "/test",

  upload.single("image"),
  (req, res) => {
    const newName = Date.now();
    testModel.sendImage(newName);
    amazonbucketHandler.uploadfileAWS(req.file, newName);
    res.send("funciona");
  }
);

export default testRouter;
