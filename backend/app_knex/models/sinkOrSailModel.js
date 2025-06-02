const knex = require('knex')(require('../knexfile')['development']);

// Create – ajoute une entrée sinkOrSail
async function createSinkOrSail(game_id, vote = 0, time, season) {
  return await knex('sinkOrSail').insert({ game_id, vote, time, season });
}

// Read – tous les enregistrements
async function getAllSinkOrSails() {
  return await knex.select().from('sinkOrSail');
}

// Read – un enregistrement spécifique
async function getSinkOrSailById(id) {
  return await knex('sinkOrSail').where({ id }).first();
}

// Read – tous les jeux sélectionnés pour Sink or Sail (via leurs IDs)
async function getSelectedGameIds() {
  const results = await knex('sinkOrSail').select('game_id');
  return results.map(r => r.game_id);
}

// Update – met à jour un vote ou autres champs
async function updateSinkOrSail(id, vote, time, season) {
  return await knex('sinkOrSail')
    .where({ id })
    .update({ vote, time, season });
}

// Incrémenter un vote pour un jeu
async function voteForGame(game_id) {
  const exists = await knex('sinkOrSail').where({ game_id }).first();
  if (exists) {
    return await knex('sinkOrSail').where({ game_id }).increment('vote', 1);
  }
  throw new Error("Ce jeu n'est pas dans Sink or Sail.");
}

// Supprimer une entrée
async function deleteSinkOrSail(id) {
  return await knex('sinkOrSail').where({ id }).del();
}

// Lire les votes totaux par jeu
async function getVotesWithGameNames() {
  return await knex('sinkOrSail')
    .join('games', 'sinkOrSail.game_id', 'games.id')
    .select('games.name', 'sinkOrSail.game_id', 'sinkOrSail.vote')
    .orderBy('sinkOrSail.vote', 'desc');
}

// Lire le nombre total de votes par jeu
async function getVoteCounts() {
  return await knex('sinkOrSail')
    .select('game_id')
    .count('* as total_votes')
    .groupBy('game_id');
}

module.exports = {
  createSinkOrSail,
  getAllSinkOrSails,
  getSinkOrSailById,
  updateSinkOrSail,
  deleteSinkOrSail,
  voteForGame,
  getVotesWithGameNames,
  getSelectedGameIds,
  getVoteCounts
};
