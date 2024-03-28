import { validationResult } from "express-validator";
import { dbUserSignUp, dbUserSignIn } from "../models/userModel.mjs"
import { dbRetrieveDirectory } from "../models/fileDirectoryModel.mjs";
import { dbAddUserFavourite, dbDeleteUserFavourite, dbRetrieveUserFavouritePaginated } from "../models/userFavouriteModel.mjs";

export async function userSignUp(req, res, next) {
  const result = validationResult(req);
  if (!result.isEmpty()) return res.status(400).json({ error: "illegal input" });
  const dbResponse = await dbUserSignUp(req.body);
  if (dbResponse.status === 200) return res.status(200).json({ message: dbResponse.message });
  else return res.status(dbResponse.status).json({ error: dbResponse.message });
}

export async function userSignIn(req, res, next) {
  const result = validationResult(req);
  const username = req.body.username;
  if (!result.isEmpty()) return res.status(400).json({ error: "illegal input" });
  const dbResponse = await dbUserSignIn(req.body);
  if (dbResponse.status === 200) {
    req.session.username = username;
    return res.status(200).json({ message: dbResponse.message });
  }
  else return res.status(dbResponse.status).json({ error: dbResponse.message });
}

export async function userSignOut(req, res, next) {
  req.session.destroy();
  return res.status(200).json({ message: "successfully signed out"});
}

export async function addUserFavourite(req, res, next) {
  const username = req.session.username;
  const torrent = await dbRetrieveDirectory(req.params.torrent);
  if (torrent.status === 404) return res.status(404).json({ message: "torrent not found" });
  const entry = new Map();
  entry["username"] = username;
  entry["title"] = torrent.data.title;
  entry["description"] = torrent.data.description;
  entry["torrent_id"] = torrent.data._id;
  const dbResponse = await dbAddUserFavourite(entry);
  if (dbResponse.status === 200) return res.status(200).json({ message: dbResponse.message });
  else return res.status(dbResponse.status).json({ error: dbResponse.message });
}

export async function retrieveUserFavouritePaginated(req, res, next) {
  const username = req.session.username;
  const page = req.query.page;
  const dbResponse = await dbRetrieveUserFavouritePaginated(username, page);
  if (dbResponse.status === 200) return res.status(200).json({ message: dbResponse.message, data: dbResponse.data });
  else return res.status(dbResponse.status).json({ error: dbResponse.message });
}

export async function deleteUserFavourite(req, res, next) {
  const username = req.session.username;
  const torrent_id = req.params.torrent;
  const dbResponse = await dbDeleteUserFavourite(torrent_id, username);
  if (dbResponse.status === 200) return res.status(200).json({ message: dbResponse.message });
  else return res.status(dbResponse.status).json({ error: dbResponse.message });
}