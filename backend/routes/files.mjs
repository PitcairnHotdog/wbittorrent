import { Router } from "express"
import { addFileInfo, retrieveFileInfo, deleteFileInfo, addDirectory, retrieveDiretory, getDirectoriesPaginated } from "../controllers/fileController.mjs"
import { sanitizeFileInfo, isAuthenticated } from "../middleware/middleware.mjs"

export const filesRouter = Router();

filesRouter.put("/info/:hash/", sanitizeFileInfo, addFileInfo);
filesRouter.get("/info/:hash/", retrieveFileInfo);

filesRouter.post("/directory/", addDirectory);
filesRouter.get("/directory/:torrent/", retrieveDiretory);
filesRouter.get("/directory-list", getDirectoriesPaginated);