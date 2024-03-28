import { Router } from "express"
import { addUserFavourite, deleteUserFavourite, retrieveUserFavouritePaginated, userSignIn, userSignOut, userSignUp } from "../controllers/userController.mjs"
import { sanitizeUserCredential, isAuthenticated } from "../middleware/middleware.mjs"

export const usersRouter = Router();

usersRouter.post("/signup/", sanitizeUserCredential, userSignUp);
usersRouter.post("/signin/", sanitizeUserCredential, userSignIn);
usersRouter.get("/signout/", sanitizeUserCredential, userSignOut);

usersRouter.post("/favourite/:torrent/", isAuthenticated, addUserFavourite);
usersRouter.get("/favourite", isAuthenticated, retrieveUserFavouritePaginated);
usersRouter.delete("/favourite/:torrent/", isAuthenticated, deleteUserFavourite);