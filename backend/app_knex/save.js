// App.js - Utilisation des opérations CRUD avec Knex
//premiers produits que j'ai quand je démarre ma BD 

const dbUser = require('./models/userModel');
const dbTeam = require('./models/teamModel');
const dbStructure = require('./models/structureModel');

async function main() {
  // Create
  await dbUser.createUser('Erik', 'Jensen', 'Production Manager',1, 1, '0', null, null, "A" );
  await dbUser.createUser( 'Kayla','Smith', 'Game Designer',2, 2, '0', null, null, "B" );
  await dbTeam.createTeam('Bezzerwizzer Development Team', null, 1, 5 );
  await dbTeam.createTeam('Game Developement Team', null, 2, 10 );
  await dbStructure.createStructure(23, 'Bezzerwizzer', 14, 'Denmark', 'Copenhagen', '08:30', '16:30', null, null, null, null );
  await dbStructure.createStructure(37, 'Exploding Kittens', 85, 'USA', 'Los Angeles', '17:00', '01:00', null, null, null, null );
  
  // Read
  const allUsers = await dbUser.getAllUsers();
  console.log('Tous les utilisateurs :', allUsers);
  const allTeams = await dbTeam.getAllTeams();
  console.log('Toutes les équipes :', allTeams);
  const allStructures = await dbStructure.getAllStructures();
  console.log('Toutes les structures :', allStructures);
  

  // Update
  // await dbStructure.updateStructure(23, 'Bezzerwizzer', '14', 'Denmark', 'Copenhagen', '09:00', '17:00' );
  // await dbStructure.updateStructure(37, 'Exploding Kittens', '85', 'USA', 'Los Angeles', '18:00', '02:00' );
  

  // Read user by ID
  const userById = await dbUser.getUserById(1);
  console.log('User par ID :', userById);
  const teamById = await dbTeam.getTeamById(1);
  console.log('Team par ID :', teamById);
  const structureById = await dbStructure.getStructureById(1);
  console.log('Structure par ID :', structureById);
  

  // Delete
  // await dbUser.deleteUser(1);
  // await dbTeam.deleteTeam(1);
  // await dbStructure.deleteStructure(1);
  
}

main().catch(err => console.error(err));
