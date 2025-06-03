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
async function updateUser(id, name, surname, jobTitle, structure_id, team_id, score_id, liked_id, image, role) {
  // Construire un objet updateData en ne mettant que les champs définis
  const updateData = {};

  if (name !== undefined) updateData.name = name;
  if (surname !== undefined) updateData.surname = surname;
  if (jobTitle !== undefined) updateData.jobTitle = jobTitle;
  if (structure_id !== undefined) updateData.structure_id = structure_id;
  if (team_id !== undefined) updateData.team_id = team_id;
  if (score_id !== undefined) updateData.score_id = score_id;
  if (liked_id !== undefined) updateData.liked_id = liked_id;
  if (role !== undefined) updateData.role = role;
  if (image !== null) updateData.image = image; // image peut être null, à voir selon ta logique

  if (Object.keys(updateData).length === 0) {
    throw new Error("Aucune donnée fournie pour la mise à jour");
  }

  return await knex('users').where({ id }).update(updateData);
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
