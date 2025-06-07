import Ballot from './Ballot.js';
import Candidate from './Candidate.js';
import HasVoted from './HasVoted.js';
import Initiative from './Initiative.js';
import InitiativeResults from './InitiativeResults.js';
import Office from './Office.js';
import OfficeCandidate from './OfficeCandidate.js';
import OfficeResults from './OfficeResults.js';
import Society from './Society.js';
import UserLogin from './User.js';

const registerModels = () => {
  // 🧑‍🤝‍🧑 User & Society
  UserLogin.belongsTo(Society, { foreignKey: 'society_id' });
  Society.hasMany(UserLogin, { foreignKey: 'society_id' });

  // 🗳️ Ballot & Society
  Ballot.belongsTo(Society, { foreignKey: 'society_id' });
  Society.hasMany(Ballot, { foreignKey: 'society_id' });

  // 🗳️ Ballot & Office
  Ballot.belongsTo(Office, { foreignKey: 'office_id' });
  Office.hasMany(Ballot, { foreignKey: 'office_id' });

  // ✅ HasVoted: Many-to-Many between Ballot & UserLogin
  UserLogin.belongsToMany(Ballot, { through: HasVoted, foreignKey: 'user_id' });
  Ballot.belongsToMany(UserLogin, { through: HasVoted, foreignKey: 'ballot_id' });

  // 🏛️ Ballot & Initiative
  Initiative.belongsTo(Ballot, { foreignKey: 'ballot_id' });
  Ballot.hasMany(Initiative, { foreignKey: 'ballot_id' });

  // 📊 InitiativeResults
  InitiativeResults.belongsTo(Ballot, { foreignKey: 'ballot_id' });
  InitiativeResults.belongsTo(Initiative, { foreignKey: 'initiative_id' });
  Ballot.hasMany(InitiativeResults, { foreignKey: 'ballot_id' });
  Initiative.hasMany(InitiativeResults, { foreignKey: 'initiative_id' });

  // 🏛️ Office & Ballot
  Office.belongsTo(Ballot, { foreignKey: 'ballot_id' });
  Ballot.hasMany(Office, { foreignKey: 'ballot_id' });

  // 🧑‍💼 Candidate <-> Office (Many-to-Many via OfficeCandidate)
  Office.belongsToMany(Candidate, { through: OfficeCandidate, foreignKey: 'office_id' });
  Candidate.belongsToMany(Office, { through: OfficeCandidate, foreignKey: 'candidate_id' });

  // 🧮 OfficeResults
  OfficeResults.belongsTo(Ballot, { foreignKey: 'ballot_id' });
  OfficeResults.belongsTo(Office, { foreignKey: 'office_id' });
  OfficeResults.belongsTo(Candidate, { foreignKey: 'candidate_id' });

  Ballot.hasMany(OfficeResults, { foreignKey: 'ballot_id' });
  Office.hasMany(OfficeResults, { foreignKey: 'office_id' });
  Candidate.hasMany(OfficeResults, { foreignKey: 'candidate_id' });
};

export default registerModels;
