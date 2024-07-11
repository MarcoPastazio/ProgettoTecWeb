import { Sequelize } from "sequelize";
import { createModel as createUserModel } from "./User.js";
import { createModel as createIdeaModel } from "./Idea.js";
import { createModel as createVoteModel } from "./Vote.js";
import { createModel as createCommentModel } from "./Comment.js";
import 'dotenv/config.js';
export const database = new Sequelize(process.env.DB_CONNECTION_URI, {
  dialect: process.env.DIALECT
});

createUserModel(database);
createIdeaModel(database);
createVoteModel(database);
createCommentModel(database);

const { User, Idea, Vote, Comment } = database.models;

User.hasMany(Idea, { foreignKey: 'userName' });
Idea.belongsTo(User, { foreignKey: 'userName' });

User.hasMany(Vote, { foreignKey: 'userName' });
Vote.belongsTo(User, { foreignKey: 'userName' });

Idea.hasMany(Vote, { foreignKey: 'ideaId' });
Vote.belongsTo(Idea, { foreignKey: 'ideaId' });

Idea.hasMany(Comment, { foreignKey: 'ideaId' });
Comment.belongsTo(Idea, { foreignKey: 'ideaId' });

User.hasMany(Comment, { foreignKey: 'userName' });
Comment.belongsTo(User, { foreignKey: 'userName' });

database.sync().then(() => {
  console.log("Database synced correctly");
}).catch(err => {
  console.error("Error with database synchronization: " + err.message);
});

export { User, Idea, Vote, Comment };
