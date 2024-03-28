import { dbBlockPossessionUpdate, dbBlockPossessionGet, dbBlockUploaderGet, dbGetTorrentSetByUploader } from "../models/blockModel.mjs";
import { dbRetrieveDirectory } from "../models/fileDirectoryModel.mjs";
import { dbRetrieveFileInfo } from "../models/fileModel.mjs";

export async function blockPossessionUpdate(req, res, next) {
  const data = req.body;
  data["_id"] = req.params.id;
  const dbResponse = await dbBlockPossessionUpdate(data);
  if (dbResponse.status === 200) return res.status(200).json({ message: dbResponse.message });
  else return res.status(dbResponse.status).json({ error: dbResponse.message });
}

export async function blockPossessionGet(req, res, next) {
  const dbResponse = await dbBlockPossessionGet(req.params.id, req.params.hash);
  if (dbResponse.status === 200) return res.status(200).json({ message: dbResponse.message, data: dbResponse.data });
  else return res.status(dbResponse.status).json({ error: dbResponse.message });
}

export async function blockUploaderGet(req, res, next) {
  const dbResponse = await dbBlockUploaderGet(req.params.hash);
  if (dbResponse.status === 200) return res.status(200).json({ message: dbResponse.message, data: dbResponse.data });
  else return res.status(dbResponse.status).json({ error: dbResponse.message });
}

export async function getDownloadProgress(req, res, next) {
  const uploader = req.params.id;
  const torrentSet = await dbGetTorrentSetByUploader(uploader);
  if (torrentSet.status === 404) return res.status(404).json({ message: torrentSet.message });
  const returnMap = new Map();
  for (const torrent_id of torrentSet.data) {
    var totalBlockCount = 0;
    var totalDownloadedBlock = 0;
    const fileMap = new Map();
    const torrentDir = await dbRetrieveDirectory(torrent_id);
    if (torrentDir.status === 404) return res.status(404).json({ message: torrentDir.message });
    for (const file of torrentDir.data.directory) {
      const fileInfo = await dbRetrieveFileInfo(file.hash);
      if (fileInfo.status === 404) return res.status(404).json({ message: fileInfo.message });
      const downloadedBlockList = await dbBlockPossessionGet(uploader, file.hash);
      if (downloadedBlockList.status === 404) return res.status(404).json({ message: downloadedBlockList.message });
      const downloadedPercentage = downloadedBlockList.data.length / fileInfo.data.block_count;
      fileMap[file.hash] = downloadedPercentage;
      totalBlockCount += fileInfo.data.block_count;
      totalDownloadedBlock += downloadedBlockList.data.length;
    }
    fileMap["total"] = totalDownloadedBlock / totalBlockCount;
    returnMap[torrent_id] = fileMap;
  }
  return res.status(200).json({ message: "success", data: returnMap });
}