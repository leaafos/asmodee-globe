// db.js - Fichier pour gérer les opérations CRUD avec Knex
const knex = require('knex')(require('../knexfile')['development']);

// Create
async function createScore(user_id, score, date, image, game_id, play_id, ranking) {
  return await knex('Scores').insert({ user_id, score, date, image, game_id, play_id, ranking });
}

// Read
async function getAllScores() {
  return await knex.select().from('Scores');
}

async function getScoreById(id) {
  return await knex('Scores').where({ id }).first();
}

// Update
async function updateScore(id, newUserId, newScore, newDate, newImage, newGameId, newPlayId, newRanking) {
  return await knex('Scores').where({ id }).update({ user_id: newUserId, score: newScore, date: newDate, image: newImage, game_id: newGameId, play_id: newPlayId, ranking: newRanking });
}

// Delete
async function deleteScore(id) {
  return await knex('Scores').where({ id }).del();
}

module.exports = {
  createScore,
  getAllScores,
  getScoreById,
  updateScore,
  deleteScore
};

// npm install knex sqlite3