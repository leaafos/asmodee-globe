// app.js (ou index.js)
const express = require('express');
const cors = require('cors');
const app = express();
const userRoutes = require('./routes/userRoutes');
const messagePTRoutes = require('./routes/messagePTRoutes');
const teamRoutes = require('./routes/teamRoutes');
const structureRoutes = require('./routes/structureRoutes');
const reactionRoutes = require('./routes/reactionRoutes');
const gameRoutes = require('./routes/gameRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const badgeRoutes = require('./routes/badgeRoutes');
const messageRoutes = require('./routes/messageRoutes');
const teamBadgesRoutes = require('./routes/teamBadgesRoutes');
const likedRoutes = require('./routes/likedRoutes'); 
const scoreRoutes = require('./routes/scoreRoutes'); 
const sinkOrSailRoutes = require('./routes/sinkOrSailRoutes'); // Assurez-vous d'importer le bon fichier de routes

app.use(cors()); 
app.use(express.json());
app.use('/', userRoutes);
app.use('/', messagePTRoutes);
app.use('/', teamRoutes);
app.use('/', structureRoutes);
app.use('/', reactionRoutes);
app.use('/', gameRoutes);
app.use('/', categoryRoutes);
app.use('/', badgeRoutes);
app.use('/', messageRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/', teamBadgesRoutes); 
app.use('/', likedRoutes); 
app.use('/', scoreRoutes); 
app.use('/', sinkOrSailRoutes); 

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
