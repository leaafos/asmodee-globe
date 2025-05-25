// db.js - Fichier pour gérer les opérations CRUD avec Knex
const knex = require('knex')(require('./knexfile')['development']);

// Create
async function createScore(score, date, ranking) {
  return await knex('Scores').insert({ score, date, ranking });
}

// Read
async function getAllScores() {
  return await knex.select().from('Scores');
}

async function getScoreById(id) {
  return await knex('Scores').where({ id }).first();
}

// Update
async function updateScore(id, newScore, newDate, newRanking) {
  return await knex('Scores').where({ id }).update({ score: newScore, date: newDate, ranking: newRanking });
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