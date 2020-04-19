const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

/**
 * Middleware de verificação de ID 
 */
function validateRepositoryId(request, response, next) {
  const { id } = request.params;
  
  if (!isUuid(id)) {
    return response.status(400).json({ error: 'Oops! Invalid repository ID'});
  }

  return next();
}

const repositories = [];

app.get("/repositories", (request, response) => {
  response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs} = request.body;

  const repo = { 
    id: uuid(), 
    title, 
    url, 
    techs, 
    likes: 0 
  };

  repositories.push(repo);

  response.json(repo);
});

app.put("/repositories/:id", validateRepositoryId, (request, response) => {
  const { id } = request.params;
  const {title, url, techs } = request.body;

  const repoIndex = repositories.findIndex(r => r.id == id);

  if (repoIndex < 0) {
    response.status(400).json({ error: 'Repositório não encontrado '});
  }

  const {likes} = repositories[repoIndex];

  const repo = {
    id,
    title,
    url,
    techs,
    likes
  };

  repositories[repoIndex] = repo;

  response.json(repo);
});

app.delete("/repositories/:id", validateRepositoryId, (request, response) => {
  const { id } = request.params;
  
  const repoIndex = repositories.findIndex(r => r.id === id);

  if (repoIndex < 0) {
    response.status(400).json({ error: 'Repositório não encontrado '});
  }

  repositories.splice(repoIndex, 1);

  response.status(204).send();
});

app.post("/repositories/:id/like", validateRepositoryId, (request, response) => {
  const { id } = request.params;

  const repo = repositories.find(r=> r.id == id);

  if (!repo) {
    response.status(400).json({ error: 'Repositório não encontrado '});
  }

  repo.likes = Number(repo.likes) + 1;

  response.json(repo);
});

module.exports = app;
