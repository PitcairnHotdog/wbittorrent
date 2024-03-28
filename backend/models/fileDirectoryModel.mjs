import { Schema } from "mongoose";
import { DBConnection } from "../database.mjs";

const fileDirectorySchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: false
    },
    directory: [
      {
        hash: {
          type: String,
          required: true
        },
        lastModified: {
          type: Date,
          required: true
        },
        name: {
          type: String,
          required: true
        },
        size: {
          type: Number,
          required: true
        },
        type: {
          type: String,
          required: false
        },
        path: {
          type: [String],
          required: true
        }
      }
    ]
  }
);

const FileDirectoryModel = DBConnection.model("FileDirectories", fileDirectorySchema);

export async function dbAddDirectory(data) {
  try {
    const dir = new FileDirectoryModel(data);
    const saved = await dir.save();
    return { status: 200, message: "success", data: { id: saved._id } };
  } catch (e) {
    console.log(e);
    return { status: 500, message: "database error" };
  }
}

export async function dbRetrieveDirectory(id) {
  try {
    const dir = await FileDirectoryModel.findOne({ _id: id }).exec();
    if (!dir) return { status: 404, message: "torrent not found" };
    else return { status: 200, message: "success", data: dir};
  } catch (e) {
    console.log(e);
    return { status: 500, message: "database error" };
  }
}

export async function dbGetDirectoriesPaginated(page) {
  try {
    const limit = 100;
    const fileList = await FileDirectoryModel.find().select("_id title description").skip((page - 1) * limit).limit(limit).exec();
    return { status: 200, message: "success", data: fileList};
  } catch (e) {
    console.log(e);
    return { status: 500, message: "database error" };
  }
}