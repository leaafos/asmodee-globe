const knex = require('knex')(require('../knexfile')['development']);
const db = require('../db'); // Si tu as déjà une instance knex dans db.js, sinon utiliser knex directement

// Create
const createTeamBadge = async (team_id, badge_id, votes, unlocked) => {
  return await db('team_badges').insert({
    team_id,
    badge_id,
    votes,
    unlocked
  });
};

// Read all team badges
async function getAllTeamBadges() {
  return await db.select().from('team_badges');
}

// Read teamBadge by ID
async function getTeamBadgeById(id) {
  return await db('team_badges').where({ id }).first();
}

// Get badges by team ID (all badges linked to a team)
const getBadgesByTeamId = async (teamId) => {
  const result = await db('team_badges')
    .join('badges', 'team_badges.badge_id', 'badges.id')
    .where('team_badges.team_id', teamId)
    .select('team_badges.id', 'badges.*', 'team_badges.votes', 'team_badges.unlocked');
  return result;
};

// Get pending badges (not unlocked) for a team
const getPendingBadgesByTeamId = async (teamId) => {
  return await db('team_badges')
    .join('badges', 'team_badges.badge_id', 'badges.id')
    .where('team_badges.team_id', teamId)
    .andWhere('team_badges.unlocked', false)
    .select('team_badges.id', 'badges.name as badge_name', 'team_badges.votes', 'badges.vote_threshold');
};

// Get unlocked badges for a team
const getUnlockedBadgesByTeamId = async (teamId) => {
  return await db('team_badges')
    .join('badges', 'team_badges.badge_id', 'badges.id')
    .where('team_badges.team_id', teamId)
    .andWhere('team_badges.unlocked', true)
    .select('team_badges.id', 'badges.name as badge_name', 'team_badges.votes');
};

// Get pending badges of other teams (not unlocked), exclude given teamId
const getPendingBadgesExcludingTeam = async (teamId) => {
  return await knex('team_badges')
    .join('badges', 'team_badges.badge_id', 'badges.id')
    .join('teams', 'team_badges.team_id', 'teams.id')
    .where('team_badges.unlocked', false)
    .andWhere('team_badges.team_id', '!=', teamId)
    .select(
      'team_badges.id',
      'team_badges.team_id',
      'teams.name as team_name',
      'team_badges.votes',
      'badges.vote_threshold', 
      'badges.id as badge_id',
      'badges.name as badge_name',
      'badges.description',
      'badges.image'
    );
};

// Update teamBadge
async function updateTeamBadge(id, team_id, badge_id, votes, unlocked) {
  return await db('team_badges').where({ id }).update({ team_id, badge_id, votes, unlocked });
}

// Delete teamBadge
async function deleteTeamBadge(id) {
  return await db('team_badges').where({ id }).del();
}

// Add a vote to a teamBadge and unlock if threshold reached
const addVote = async (teamBadgeId) => {
  // Increment votes
  await db('team_badges')
    .where('id', teamBadgeId)
    .increment('votes', 1);

  // Check if vote threshold reached
  const teamBadge = await db('team_badges')
    .join('badges', 'team_badges.badge_id', 'badges.id')
    .select('team_badges.votes', 'badges.vote_threshold')
    .where('team_badges.id', teamBadgeId)
    .first();

  if (teamBadge.votes >= teamBadge.vote_threshold) {
    await db('team_badges')
      .where('id', teamBadgeId)
      .update({ unlocked: true });
  }
};

module.exports = {
  createTeamBadge,
  getAllTeamBadges,
  getTeamBadgeById,
  getBadgesByTeamId,
  updateTeamBadge,
  deleteTeamBadge,
  getPendingBadgesByTeamId,
  getUnlockedBadgesByTeamId,
  getPendingBadgesExcludingTeam,
  addVote
};
