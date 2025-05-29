// db.js - Fichier pour gérer les opérations CRUD avec Knex
const knex = require('knex')(require('../knexfile')['development']);

// Create
async function createUser(name, surname, jobTitle, structure_id, team_id, score_id, liked_id, image, role) {
  return knex('users').insert({
  name,
  surname,
  jobTitle,
  structure_id,
  team_id,
  score_id,
  liked_id,
  image,
  role
});
}

// Read
async function getAllUsers() {
  return await knex.select().from('users');
}

async function getUserById(id) {
  return await knex('users').where({ id }).first();
}

async function getUserByName(name) {
  return await knex('users').where({ name }).first();
}


// Update
async function updateUser(id, newName, newSurname, newJobTitle, newStructureId, newTeamId, newScoreId, newLiked_id, newImage, newRole) {
  return await knex('users').where({ id }).update({ name: newName, surname : newSurname, jobTitle: newJobTitle, structure_id: newStructureId, team_id: newTeamId, score_id: newScoreId, liked_id: newLiked_id, image: newImage, role: newRole });
}

// Delete
async function deleteUser(id) {
  return await knex('users').where({ id }).del();
}

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserByName
};

// npm install knex sqlite3