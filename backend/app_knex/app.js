// app.js (ou index.js)
const express = require('express');
const app = express();
const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messagePTRoutes');
const teamRoutes = require('./routes/teamRoutes');
const structureRoutes = require('./routes/structureRoutes');


app.use(express.json());
app.use('/', userRoutes);
app.use('/', messageRoutes);
app.use('/', teamRoutes);
app.use('/', structureRoutes);

//ajouter les routes de chaque table ici 


// const allowedApiKeys = ['TestP3', 'YOUR_API_KEY_1', 'YOUR_API_KEY_2']; //la liste des clés API autorisées

// function apiKeyAuthMiddleware(req, res, next) {
//   const apiKey = req.headers['x-api-key']; 

//   if (!apiKey || !allowedApiKeys.includes(apiKey)) {
//     return res.status(401).json({ error: 'Clé API non valide' });
//   }

//   next();
// }

// app.use(apiKeyAuthMiddleware);

app.get('/', (req, res) => {
  res.send('Bienvenue sur la page d\'accueil !');
});

const PORT = 80;
app.listen(PORT, () => {
  console.log(`Le serveur Express écoute sur le port ${PORT}`);
});
