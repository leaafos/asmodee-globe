// db.js - Fichier pour gérer les opérations CRUD avec Knex
const knex = require('knex')(require('../knexfile')['development']);

// Create
async function createTeam( name, badgeTeam_id, structure_id, staff) {
  return await knex('Teams').insert({ name, badgeTeam_id, structure_id, staff});
}

// Read
async function getAllTeams() {
  return await knex('teams')
    .select(
      'teams.*',
      'structures.country',
      'structures.city'
    )
    .leftJoin('structures', 'teams.structure_id', 'structures.id');
}

async function getTeamById(id) {
  return await knex('teams')
    .select(
      'teams.*',
      'structures.country',
      'structures.city'
    )
    .leftJoin('structures', 'teams.structure_id', 'structures.id')
    .where('teams.id', id)
    .first();
}

// Update
async function updateTeam(id, newName, newBadgeTeam_id, newStructure_id, newStaff) {
  return await knex('Teams').where({ id }).update({ name: newName, badgeTeam_id: newBadgeTeam_id, structure_id: newStructure_id, staff: newStaff});
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