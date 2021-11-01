import axios from "axios";
import mongoose from "mongoose";

export default class BaseController {
  constructor(apiRoot, model) {
    // rotas que serão criadas
    // route => path
    // method => HTTP Verb da rota: GET, POST, PUT, DELETE
    // action => funcão que deverá ser executada no controller
    this.routes = [
      { route: "/todas", method: "getTodas", action: "get" },
      { route: "/todas", method: "createTodas", action: "post" },

      { route: "", method: "create", action: "post" },
      { route: "", method: "get", action: "get" },

      { route: "/:country", method: "getByCountry", action: "get" },

      { route: "/id/:id", method: "getById", action: "get" },
      { route: "/:id", method: "update", action: "put" },
      { route: "/:id", method: "remove", action: "delete" },
    ];

    this.apiRoot = apiRoot;
    this.model = model;
    this.Paises = [
      "Argentina",
      "Brazil",
      "Chile",
      "Colombia",
      "Paraguay",
      "Peru",
      "Suriname",
      "Uruguay",
    ];
    this.universities = [];
  }

  getTodas(req, res) {
    return this.model
      .find({})
      .then((items) => res.send(items))
      .catch((err) =>
        res.status(400).send("Erro ao encontrar universidades: ", err)
      );
  }

  createTodas(req, res) {
    const item = new this.model();
    const conn = mongoose.connection;

    return item
      .save({
        name: {
          unique: true,
          index: true,
        },
      })
      .then(async () => {
        for (let i = 0; i <= this.Paises.length; i++) {
          const { data } = await axios(
            `http://universities.hipolabs.com/search?country=${this.Paises[i]}`
          );
          this.universities.push(data);
          conn.collection(`${this.Paises[i]}`).insert(this.universities[i]);
          conn.collection("todas").insert(this.universities[i]);
        }

        return res.json(this.universities);
      })
      .catch((err) => res.status(422).send(err.message));
  }

  ///
  get(req, res) {
    let perPage = 20,
      page = Math.max(0, req.param("page"));
    return this.model
      .find({}, { alpha_two_code: 0, domains: 0, web_pages: 0 })
      .limit(perPage)
      .skip(perPage * page)
      .sort({
        name: "asc",
      })
      .then((items) => {
        res.json(items);
      })
      .catch((err) =>
        res
          .status(400)
          .send("Error ao tentar carregar lista de Universidades: " + err)
      );
  }

  getByCountry(req, res) {
    const {
      params: { country },
    } = req;

    return this.model
      .find(
        { country: { $regex: country, $options: "i" } },
        { alpha_two_code: 0, domains: 0, web_pages: 0 }
      )
      .then((items) => res.json(items))
      .catch((err) =>
        res
          .status(400)
          .send("Erro ao tentar encontrar universidade deste Pais: ", err)
      );
  }

  getById(req, res) {
    const {
      params: { id },
    } = req;

    return this.model
      .find({ _id: id }, { alpha_two_code: 0, domains: 0, web_pages: 0 })
      .then((items) => res.json(items))
      .catch((err) =>
        res
          .status(400)
          .send("Erro ao tentar encontrar universidade especificada: ", err)
      );
  }

  create(req, res) {
    const item = new this.model(req.body);

    return item
      .save({
        name: { unique: true, index: true },
      })
      .then(() =>
        res
          .status(201)
          .send(
            res.json({ message: "Universidade Cadastrada com Sucesso!" }),
            item
          )
      )
      .catch((err) => {
        if (err.code === 11000) {
          res.send("Ja existe essa universidade no banco!");
        } else {
          res.send("Erro ao tentar salvar Universidade....: " + err);
        }
      });
  }

  update(req, res) {
    return this.model
      .findOneAndUpdate({ _id: req.params.id }, req.body)
      .then(() => {
        res.json({ message: "Universidade atualizada com sucesso!" });
      })
      .catch((err) => res.send("Erro ao atualizar a universidade: " + err));
  }

  remove(req, res) {
    return this.model
      .remove({ _id: req.params.id })
      .then(() => {
        res.json({ message: "Universidade Excluída com Sucesso!" });
        res.sendStatus(204);
      })
      .catch((err) =>
        res.status(400).send("Id da Universidade não encontrado: " + err)
      );
  }
}
