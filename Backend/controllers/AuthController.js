import { User, Idea } from "../models/Database.js";
import Jwt from "jsonwebtoken";


export class AuthController {
  /**
   * Gestisce le richieste di posta su /auth. Controlla che le credenziali date siano valide
   * @param {http.IncomingMessage} request 
   * @param {http.ServerResponse} response 
   */
  static async checkCredentials(req, res){
    let user = new User({ 
      username: req.body.username, 
      password: req.body.password
    });

    let found = await User.findOne({
      where: {
        username: user.username,
        password: user.password 
      }
    });

    return found !== null;
  }

  
  static async saveUser(req, res){
    let user = new User({
      username: req.body.username, 
      password: req.body.password
    });
    return user.save();
  }

  static issueToken(username){
    return Jwt.sign({user:username}, process.env.TOKEN_SECRET, {expiresIn: `${24*60*60}s`});
  }

  static isTokenValid(token, callback){
    Jwt.verify(token, process.env.TOKEN_SECRET, callback);
  }

  static async canUserModifyIdea(user, ideaId) {
    const idea = await Idea.findByPk(ideaId);
    return idea && idea.userName === user;
  }
}