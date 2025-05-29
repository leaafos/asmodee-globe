// db.js - Fichier pour gérer les opérations CRUD avec Knex
const knex = require('knex')(require('../knexfile')['development']);

// Create

async function createStructure(name, staff, country, city, timeStart, timeEnd, website, latitude, longitude, size) {
  return await knex('structures').insert({
    name,
    staff,
    country,
    city,
    timeStart,
    timeEnd,
    website,
    latitude,
    longitude,
    size
  });
}

// Read
async function getAllStructures() {
  return await knex.select('*').from('Structures');
}

async function getStructureById(id) {
  return await knex('Structures').where({ id }).first();
}

// Update
async function updateStructure(id, newName, newStaff, newCountry, newCity, newTimeStart, newTimeEnd, newWebsite, newLatitude, newLongitude, newSize) {
  return await knex('Structures').where({ id }).update({ name: newName, staff: newStaff, country: newCountry, city: newCity, timeStart: newTimeStart, timeEnd: newTimeEnd, website: newWebsite, latitude: newLatitude, longitude: newLongitude, size: newSize });
}

// Delete
async function deleteStructure(id) {
  return await knex('Structures').where({ id }).del();
}

module.exports = {
  createStructure,
  getAllStructures,
  getStructureById,
  updateStructure,
  deleteStructure
};

// npm install knex sqlite3