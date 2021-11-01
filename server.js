//Chamada dos pacotes
const cors = require("cors");
const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose");
const University = require("./app/models/universities");
mongoose.Promise = global.Promise;

//Local
mongoose.connect("mongodb://localhost:27017/BD_universidades", {
  useMongoClient: true,
});

const conn = mongoose.connection;

const router = express.Router();

app.use(cors());

const Paises = [
  "Argentina",
  "Brazil",
  "Chile",
  "Colombia",
  "Paraguay",
  "Peru",
  "Suriname",
  "Uruguay",
];

const universities = [];

//Configuração da variavel app para usar o bodyParser()
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Definindo porta onde sera execultada a api
const port = process.env.port || 8000;

//Rotas da nossa API:
//=====================================================
// Rota de teste
router.use(function (req, res, next) {
  console.log("Algo esta acontecendo.....");
  next();
});

// Popular banco
router
  .route("/universities/todas")
  .post(async (req, res) => {
    try {
      for (let i = 0; i <= Paises.length; i++) {
        const { data } = await axios(
          `http://universities.hipolabs.com/search?country=${Paises[i]}`
        );
        universities.push(data);
        conn.collection(`${Paises[i]}`).insert(universities[i]);
        conn.collection("todas").insert(universities[i]);
      }

      return res.json(universities);
    } catch (error) {
      console.log(error);
    } finally {
    }
  })

  .get(function (req, res) {
    University.find({}, function (error, university) {
      if (error) res.send("Erro ao encontrar universidades: ", error);

      res.json(university);
    });
  });

router
  .route("/universities/")

  // criar
  .post(function (req, res) {
    const university = new University();

    university.alpha_two_code = req.body.alpha_two_code;
    university.web_pages = req.body.web_pages;
    university.name = req.body.name;
    university.country = req.body.country;
    university.domains = req.body.domains;
    university.state_province = req.body.state_province;

    university.save({ index: true, name: { unique: true } }, function (error) {
      if (error) {
        if (error.code === 11000) {
          res.send("Ja existe essa universidade no banco!");
        } else {
          res.send("Erro ao tentar salvar Universidade....: " + error);
        }
        return;
      }
      res.json({ message: "Universidade Cadastrada com Sucesso!" });
    });

    //
  })

  //Buscar todas Universidades

  .get(function (req, res) {
    let perPage = 20,
      page = Math.max(0, req.param("page"));
    University.find(
      {},
      { alpha_two_code: 0, domains: 0, web_pages: 0  },
      function (error, universities) {
        if (error) {
          res.send("Error ao tentar carregar lista de Universidades: " + error);
        }
        res.json(universities);
      }
    )
      .limit(perPage)
      .skip(perPage * page)
      .sort({
        name: "asc",
      });
  });

// Filtrar por Pais
router.route("/universities/:country").get(function (req, res) {
  University.find(
    { country: { $regex: req.params.country, $options: "i" } },
    { alpha_two_code: 0, domains: 0, web_pages: 0 },
    function (error, university) {
      if (error)
        res.send("Erro ao tentar encontrar universidade deste Pais: ", error);

      res.json(university);
    }
  );
});

// Buscar por iD,
router.route("/universities/id/:id").get(function (req, res) {
  University.findById(
    req.params.id,
    { alpha_two_code: 0, domains: 0, web_pages: 0 },
    function (error, university) {
      if (error)
        res.send("Erro ao tentar encontrar universidade especificada: ", error);
      res.json(university);
    }
  );
});

//Atualizar e Deletar
router
  .route("/universities/:university_id")

  .put(function (req, res) {
    //Primeiro: para atualizarmos, precisamos primeiro achar 'Id' da 'Universidade':
    University.findById(req.params.university_id, function (error, university) {
      if (error) res.send("Id da Universidade não encontrado....: " + error);

      //Segundo:
      university._id = req.params.university_id;
      university.web_pages = req.body.web_pages;

      //Terceiro: Agora que já atualizamos os dados, vamos salvar as propriedades:
      university.save(function (error) {
        if (error) res.send("Erro ao atualizar a universidade: " + error);
        res.json({ message: "Universidade atualizada com sucesso!" });
      });
    });
  })

  .delete(function (req, res) {
    University.remove(
      {
        _id: req.params.university_id,
      },
      function (error) {
        if (error) res.send("Id da Universidade não encontrado: " + error);

        res.json({ message: "Universidade Excluída com Sucesso!" });
      }
    );
  });

//Definindo prefixo das rotas
app.use("/api", router);

// Visualizar nome das universidades na posição 0 no HTML
app.get('/', async function (req,res) {
  try {
    for (let i = 0; i <= Paises.length; i++) {
      const { data } = await axios(
        `http://universities.hipolabs.com/search?country=${Paises[i]}`
      );
      universities.push(data);
    }

    return res.json(universities[0]);
  } catch (error) {
    console.log(error);
  } finally {
  }
})

//Iniciando aplicação Servidor
app.listen(port);
console.log("Iniciando app na porta: " + port);
