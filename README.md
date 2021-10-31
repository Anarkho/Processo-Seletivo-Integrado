# Processo-Seletivo-Integrado
Projeto Back-end em Node.js e MongoDB

### Ferramentas usadas para testar
- Postman
    Rotas: prefix = http://localhost:8000/api

   #### /universities/todas
    -  'Get' retorna todas universidades sem redução de dados saida 
    -  'Post' abastece banco com coleção de todas universidades e colecões com nome de cada País
    ///////////////////////////////////////////////////////////////////////////////////////
   #### /universities
    - 'Get' retorna todas universidades com redução de dados na saida e paginação
    - 'Post' cadastra nova universidade na coleção de todas
    ///////////////////////////////////////////////////////////////////////////////////////
   #### /universities/:country
    - 'Get' retorna todas as universidades cujo parametro assemelhe a propriedade País
    ///////////////////////////////////////////////////////////////////////////////////////
   #### /universities/id/:id
    - 'Get' retorna universidade especifica  do id correspondente
    ///////////////////////////////////////////////////////////////////////////////////////
   #### /universities/:university_id
    - 'Put' atualiza a propriedade web_pages do id correspondente
    - 'Delete' deleta a universidade com id correspondente

- mongoDB-Compass

### Comandos
- npm start : execultar servidor
- npm run dev : sincronizar com o browser em outra porta com a ajuda da lib lite-server e cors