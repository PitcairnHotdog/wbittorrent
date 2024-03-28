import { Router } from "express"
import { blockPossessionUpdate, blockPossessionGet, blockUploaderGet, getDownloadProgress } from "../controllers/blockController.mjs"

export const blocksRouter = Router();

blocksRouter.put("/public/:id/", blockPossessionUpdate);
blocksRouter.get("/public/possession/:id/:hash/", blockPossessionGet);
blocksRouter.get("/public/uploader/:hash/", blockUploaderGet);
blocksRouter.get("/download-progress/:id/", getDownloadProgress);