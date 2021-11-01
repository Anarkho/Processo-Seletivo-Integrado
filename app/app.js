//Chamada dos pacotes
import cors from "cors";
import express from "express";
import bodyParser from "body-parser";
import routes from "./routes";
import database from "./config";

const app = express();

const configureExpress = () => {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.text());
  app.use(bodyParser.json({ type: "application/json" }));

  app.use("/api", routes);
  app.use(cors());

  return app;
};

export default () => database.connect().then(configureExpress);
