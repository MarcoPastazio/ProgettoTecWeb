import { Idea, Comment, User, Vote } from "../models/Database.js";
import { Sequelize } from "sequelize";

export class HiveMindController {

  // Metodo per pubblicare una nuova idea
  static async editIdea(req) {
    const { title, description } = req.body;
    const idea = Idea.build({ title, description, userName: req.username });
    return idea.save();
  }

  // Metodo per votare un'idea
  static async voteIdea(req) {
    try {
      const { id } = req.params;
      const { type } = req.body;
      const userName = req.username;

      if (type !== 'like' && type !== 'dislike') {
        throw new Error('Tipo di voto invalido');
      }
  
      const idea = await Idea.findByPk(id);
      if (!idea) {
        throw new Error('Idea non trovata');
      }
  
      const existingVote = await Vote.findOne({ where: { userName, ideaId: id } });
      if (existingVote) {
        throw new Error('Hai già votato questa idea');
      }
  
      await Vote.create({ type, userName, ideaId: id });
  
      if (type === 'like') {
        idea.nlike++;
      } else if (type === 'dislike') {
        idea.ndislike++;
      }
  
      return idea.save();
  
    } catch (error) {
      console.error('Errore durante l\'elaborazione del voto:', error);
      throw new Error(error);
    }
  }

  // Metodo per avere tutte le idee
  static async getAllIdeas(req) {
    try {
      const limit = 10;
      const offset = req.query.offset ? parseInt(req.query.offset, 10) : 0;

      const ideas = await Idea.findAll({
        limit: limit,
        offset: offset
      });
      return ideas;
    } catch (err) {
      throw new Error('Internal server error');
    }
  }

  
  // Metodo per ottenere le idee più controverse
  static async getControversialIdeas(req) {
    const limit = 10;
    const offset = req.query.offset ? parseInt(req.query.offset, 10) : 0;
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    return Idea.findAll({
      attributes: {
        include: [
          [Sequelize.literal('ABS(nlike - ndislike)'), 'voteSum']
        ]
      },
      where: {
        createdAt: {
          [Sequelize.Op.gte]: oneWeekAgo
        }
      },
      order: [
        [Sequelize.literal('ABS(nlike - ndislike)'), 'ASC'],
        [Sequelize.literal('nlike + ndislike'), 'DESC']
      ],
      limit: limit,
      offset: offset
    });
  }

  // Metodo per ottenere le idee più impopolari
  static async getUnpopularIdeas(req) {
    const limit = 10;
    const offset = req.query.offset ? parseInt(req.query.offset, 10) : 0;
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    return Idea.findAll({
      attributes: {
        include: [
          [Sequelize.literal('nlike - ndislike'), 'voteSum']
        ]
      },
      where: {
        createdAt: {
          [Sequelize.Op.gte]: oneWeekAgo
        }
      },
      order: [[Sequelize.literal('nlike - ndislike'), 'ASC']],
      limit: limit,
      offset: offset
    });
  }

  // Metodo per ottenere le idee più mainstream
  static async getMainstreamIdeas(req) {
    const limit = 10;
    const offset = req.query.offset ? parseInt(req.query.offset, 10) : 0;
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    return Idea.findAll({
      attributes: {
        include: [
          [Sequelize.literal('nlike - ndislike'), 'voteSum']
        ]
      },
      where: {
        createdAt: {
          [Sequelize.Op.gte]: oneWeekAgo
        }
      },
      order: [[Sequelize.literal('nlike - ndislike'), 'DESC']],
      limit: limit,
      offset: offset
    });
  }

  // Metodo per eliminare una specifica idea
  static async delete(req) {
    const { id } = req.params;
    return new Promise((resolve, reject) => {
      this.getIdeaDetails(req).then(idea => {
        idea.destroy().then(() => { resolve(idea) })
      });
    });
  }

  // Metodo per ottenere una specifica idea con commenti e voto
  //e mi serve per la delete
  static async getIdeaDetails(req) {
    const { id } = req.params;
    return Idea.findByPk(id, {
      include: [
        {
          model: Comment,
          attributes: ['content', 'username', 'createdAt']
        }
      ]
    });
  }

  
  // Metodo per ottenere i commenti per una specifica idea
  static async getComments(req) {
    const { id: ideaId } = req.params;
    return Comment.findAll({
      where: { ideaId }
    });
  }
  
  
  //Metodo per postare un commento
  static async postComment(req) {
    const { content, ideaId } = req.body.commento;
    const userName = req.username;

    await Comment.create({
      content,
      ideaId,
      userName
    });

    const idea = await Idea.findByPk(ideaId);
    if (!ideaId) {
      throw new Error('Idea non trovata');
    }
    idea.ncomments++;

    return idea.save();

  } 

  //Metodo per contare le idee
  static async countIdeas() {
    try {
      const count = await Idea.count();
      return { totalCount: count };
    } catch (err) {
      throw new Error('Internal server error');
    }
  }
  
}
