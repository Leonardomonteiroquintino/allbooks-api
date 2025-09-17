// server.js

const bodyParser = require('body-parser');
const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('./src/data/database.json');

// Rotas públicas e middleware
const publicRoutes = require('./routes/publicRoutes');
const authenticationMiddleware = require('./middleware/authenticationMiddleware');

// Configurações básicas
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());
server.use(jsonServer.defaults());

// Rotas públicas (sem autenticação)
server.use('/public', publicRoutes);

// Middleware de autenticação para todas as rotas que não sejam públicas
server.use((req, res, next) => {
  const isPublic = req.path.startsWith('/public');
  if (isPublic) {
    return next();
  }
  return authenticationMiddleware(req, res, next);
});

// Rotas protegidas (livros, autores, categorias, etc.)
server.use(router);

// Inicializa o servidor
server.listen(8000, () => {
  console.log(“API disponível em http://localhost:8000”);
});
