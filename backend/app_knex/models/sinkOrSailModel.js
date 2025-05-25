// db.js - Fichier pour gérer les opérations CRUD avec Knex
const knex = require('knex')(require('../knexfile')['development']);

// Create
async function createSinkOrSail(id, vote, time, season) {
  return await knex('SinkOrSails').insert({  vote, time, season});
}

// Read
async function getAllSinkOrSails() {
  return await knex.select().from('SinkOrSails');
}

async function getSinkOrSailById(id) {
  return await knex('SinkOrSails').where({ id }).first();
}

// Update
async function updateSinkOrSail(id, newVote, newTime, newSeason) {
  return await knex('SinkOrSails').where({ id }).update({ vote: newVote, time: newTime, season: newSeason });
}

// Delete
async function deleteSinkOrSail(id) {
  return await knex('SinkOrSails').where({ id }).del();
}

module.exports = {
  createSinkOrSail,
  getAllSinkOrSails,
  getSinkOrSailById,
  updateSinkOrSail,
  deleteSinkOrSail
};

// npm install knex sqlite3