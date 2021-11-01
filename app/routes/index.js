import express from "express";
import RouterHandler from "./routerHandler";

import UniversitiesController from '../controllers/universities';
import University from '../models/universities';

const router = express.Router();

// para adicionar rotas para novos controllers, só adicionar os 
// controllers no array abaixo
const controllers = [new UniversitiesController(University, '/universities')];
const routerHandler = new RouterHandler(router, controllers);
routerHandler.registerRoutes();

router.get("/", (req, res) =>
  res.json({ message: "Bem Vindo(a) a API!" })
);

export default router;