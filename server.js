import setupApp from "./app/app";
const port = 8000;

setupApp()
  .then(app =>
    app.listen(port, () => console.log(`Executando na porta ${port}`))
  )
  .catch(error => {
    console.error(error);
    process.exit(1);
  });