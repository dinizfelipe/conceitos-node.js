const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");
const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function findIndex(request, response, next) {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex((repo) => repo.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: "Repositório não encontrado!" });
  }

  request.index = repositoryIndex;

  return next();
}

app.get("/repositories", (request, response) => {
  return response.json(repositories)
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    url,
    title,
    techs,
    likes: 0
  }

  repositories.push(repository);

  return response.json(repository)

});

app.put("/repositories/:id", findIndex, (request, response) => {
  const { id } = request.params;
  const index = request.index;
  const { title, url, techs } = request.body;


  const repositorytIndex = repositories.findIndex(repository => repository.id === id)


  if (repositorytIndex < 0) {
    return response.status(400).json({ error: 'Projeto inexistente, tento novamente!' })
  }

  const novoRepositorio = {
    id,
    title,
    url,
    techs,
    likes: repositories[index].likes,

  }

  repositories[repositorytIndex] = novoRepositorio

  return response.json(novoRepositorio)

});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params

  const repositoryToDelet = repositories.findIndex((repositories) => repositories.id === id)

  if (repositoryToDelet < 0) {
    return response.status(400).json({ error: 'project not found, try again!' })
  }


  repositories.splice(repositoryToDelet, 1)

  return response.status(204).send()

});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repository = repositories.find(repository => repository.id === id);

  if (!isUuid(id)) {
    return response.status(400).json({ error: 'Invalid project ID' })
  } else {
    repository.likes += 1;
    return response.json(repository);
  }


});

module.exports = app;
