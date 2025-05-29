// db.js - Fichier pour gérer les opérations CRUD avec Knex
const knex = require('knex')(require('../knexfile')['development']);
const db = require('../db')

// Create
// async function createTeamBadge( team_id, badge_id, votes, unlocked ) {
//   return await knex('TeamBadges').insert({ team_id, badge_id, votes, unlocked });
// }

const createTeamBadge = async (team_id, badge_id, votes, unlocked) => {
  return await db('team_badges').insert({
    team_id,
    badge_id,
    votes,
    unlocked
  });
};

// Read
async function getAllTeamBadges() {
  return await knex.select().from('TeamBadges');
}

async function getTeamBadgeById(id) {
  return await knex('TeamBadges').where({ id }).first();
}

const getBadgesByTeamId = async (teamId) => {
  const result = await db('team_badges')
    .join('badges', 'team_badges.badge_id', 'badges.id')
    .where('team_badges.team_id', teamId)
    .select('badges.*');
  return result;
};

// Update
async function updateTeamBadge(id, team_id, badge_id, votes, unlocked) {
  return await knex('TeamBadges').where({ id }).update({ team_id, badge_id, votes, unlocked });
}

// Delete
async function deleteTeamBadge(id) {
  return await knex('TeamBadges').where({ id }).del();
}

module.exports = {
  createTeamBadge,
  getAllTeamBadges,
  getTeamBadgeById,
  updateTeamBadge,
  deleteTeamBadge,
  getBadgesByTeamId
};

