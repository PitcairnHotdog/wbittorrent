import { Schema } from "mongoose"
import { DBConnection } from "../database.mjs"

const blockSchema = new Schema(
  {
    _id: {                      // Uploader id
      type: String,
      required: true,
      unique: true
    },
    file_map: {
      type: Map,
      of: new Schema(
        {
          _id: {                // File hash
            type: String,
            required: true,
            unique: true
          },
          block_list: {
            type: [Number],     // Block hash
            required: true
          },
          torrent_id: {
            type: String,
            required: true
          }
        }
      )
    }
  },
  { timestamps: true }
);

blockSchema.index({ "updatedAt": 1 }, { expireAfterSeconds: 90 });

const BlockModel = DBConnection.model("Blocks", blockSchema);

export async function dbBlockPossessionUpdate(data) {
  try {
    await BlockModel.findOneAndUpdate({ _id: data._id }, data, { upsert: true }).exec();
    return { status: 200, message: "success" };
  } catch (e) {
    console.log(e);
    return { status: 500, message: "database error" };
  }
}

export async function dbBlockPossessionGet(id, hash) {
  try {
    const user = await BlockModel.findOne({ _id: id }).exec();
    if (!user) return { status: 404, message: "uploader id not found" };
    const file = user.file_map.get(hash);
    if (!file) return { status: 200, message: "the uploader does not possess any part of the file", data: [] };
    return { status: 200, message: "success", data: file.block_list };
  } catch (e) {
    console.log(e);
    return { status: 500, message: "database error" };
  }
}

export async function dbBlockUploaderGet(hash) {
  try {
    const results = await BlockModel.aggregate([
      { $addFields: { fileMaps: { $objectToArray: "$file_map" } } },
      { $unwind: "$fileMaps" },
      { $match: {"fileMaps.k": hash } },
      { $project: { _id: 1 } }
    ]).exec();
    if (!results) return { status: 404, message: "file not found" };
    return { status: 200, message: "success", data: results.map(doc => doc._id) };
  } catch (e) {
    console.log(e);
    return { status: 500, message: "database error" };
  }
}

export async function dbGetTorrentSetByUploader(id) {
  try {
    const user = await BlockModel.findOne({ _id: id }).exec();
    if (!user) return { status: 404, message: "uploader id not found" };
    const fileList = user.file_map;
    const torrentSet = new Set();
    fileList.forEach((value, key) => {
      torrentSet.add(value.torrent_id);
    })
    return { status: 200, message: "success", data: torrentSet };
  } catch (e) {
    console.log(e);
    return { status: 500, message: "database error" };
  }
}