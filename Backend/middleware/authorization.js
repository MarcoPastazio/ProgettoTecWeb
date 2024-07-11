import { AuthController } from "../controllers/AuthController.js";

export function enforceAuthentication(req, res, next){
  const authHeader = req.headers['authorization']
  const token = authHeader?.split(' ')[1];
  if(!token){
    next({status: 401, message: "Non autorizzato"});
    return;
  }
  AuthController.isTokenValid(token, (err, decodedToken) => {
    if(err){
      next({status: 401, message: "Non autorizzato"});
    } else {
      req.username = decodedToken.user;
      next();
    }
  });
}

export async function ensureUsersModifyOnlyOwnIdeas(req, res, next){
  const user = req.username;
  const ideaId = req.params.id;
  const userHasPermission = await AuthController.canUserModifyIdea(user, ideaId);
  if(userHasPermission){
    next();
  } else {
    next({
      status: 403, 
      message: "Vietato! Non hai i permessi per visualizzare o modificare questa risorsa"
    });
  }
}
