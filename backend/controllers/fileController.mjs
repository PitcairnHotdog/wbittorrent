import { validationResult  } from "express-validator";
import { dbAddFileInfo, dbRetrieveFileInfo, dbDeleteFileInfo } from "../models/fileModel.mjs";
import { dbAddDirectory, dbRetrieveDirectory, dbGetDirectoriesPaginated } from "../models/fileDirectoryModel.mjs";

export async function addFileInfo(req, res, next) {
  const result = validationResult(req);
  if (!result.isEmpty()) return res.status(400).json({ error: "illegal input" });
  const data = req.body;
  data["_id"] = req.params.hash;
  const dbResponse = await dbAddFileInfo(data);
  if (dbResponse.status === 200) return res.status(200).json({ message: dbResponse.message });
  else return res.status(dbResponse.status).json({ error: dbResponse.message });
}

export async function retrieveFileInfo(req, res, next) {
  const dbResponse = await dbRetrieveFileInfo(req.params.hash);
  if (dbResponse.status === 200) return res.status(200).json({ message: dbResponse.message, data: dbResponse.data });
  else return res.status(dbResponse.status).json({ error: dbResponse.message });
}

export async function deleteFileInfo(req, res, next) {
  const dbResponse = await dbDeleteFileInfo(req.params.hash);
  if (dbResponse.status === 200) return res.status(200).json({ message: dbResponse.message });
  else return res.status(dbResponse.status).json({ error: dbResponse.message });
}

export async function addDirectory(req, res, next) {
  const dbResponse = await dbAddDirectory(req.body);
  if (dbResponse.status === 200) return res.status(200).json({ message: dbResponse.message, data: dbResponse.data });
  else return res.status(dbResponse.status).json({ error: dbResponse.message });
}

export async function retrieveDiretory(req, res, next) {
  const dbResponse = await dbRetrieveDirectory(req.params.torrent);
  if (dbResponse.status === 200) return res.status(200).json({ message: dbResponse.message, data: dbResponse.data });
  else return res.status(dbResponse.status).json({ error: dbResponse.message });
}

export async function getDirectoriesPaginated(req, res, next) {
  const dbResponse = await dbGetDirectoriesPaginated(req.query.page, req.query.limit);
  if (dbResponse.status === 200) return res.status(200).json({ message: dbResponse.message, data: dbResponse.data, totalCount: dbResponse.totalCount });
  else return res.status(dbResponse.status).json({ error: dbResponse.message });
}