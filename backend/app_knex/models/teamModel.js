// db.js - Fichier pour gérer les opérations CRUD avec Knex
const knex = require('knex')(require('../knexfile')['development']);

// Create
async function createTeam(id, name, staff) {
  return await knex('Teams').insert({ name, staff});
}

// Read
async function getAllTeams() {
  return await knex.select().from('Teams');
}

async function getTeamById(id) {
  return await knex('Teams').where({ id }).first();
}

// Update
async function updateTeam(id, newName, newStaff) {
  return await knex('Teams').where({ id }).update({ name: newName, staff: newStaff});
}

// Delete
async function deleteTeam(id) {
  return await knex('Teams').where({ id }).del();
}

module.exports = {
  createTeam,
  getAllTeams,
  getTeamById,
  updateTeam,
  deleteTeam
};

// npm install knex sqlite3