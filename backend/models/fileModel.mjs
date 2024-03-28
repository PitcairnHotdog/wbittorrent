import { Schema } from "mongoose";
import { DBConnection } from "../database.mjs";

const fileSchema = new Schema(
  {
    _id: {
      type: String,
      required: true,
      unique: true
    },
    block_count: {
      type: Number,
      required: true
    },
    block_hash: {
      type: [String],
      required: true
    },
    path: {
      type: String,
      required: false
    },
    last_modified: {
      type: Date,
      required: true
    }
  }
);

export const FileModel = DBConnection.model("Files", fileSchema);

export async function dbAddFileInfo(data) {
  try {
    const check = await FileModel.findOne({ _id: data._id }).exec();
    if (check) return { status: 409, message: "file already exists" };
    if (!data.last_modified) data.last_modified = new Date();
    else data.last_modified = new Date(data.last_modified);
    const file = new FileModel(data);
    await file.save();
    return { status: 200, message: "success" };
  } catch (e) {
    console.log(e);
    return { status: 500, message: "database error" };
  }
}

export async function dbRetrieveFileInfo(hash) {
  try {
    const file = await FileModel.findOne({ _id: hash }).exec();
    if (!file) return { status: 404, message: "file not found" };
    else return { status: 200, message: "success", data: file };
  } catch (e) {
    console.log(e);
    return { status: 500, message: "database error" };
  }
}

export async function dbDeleteFileInfo(hash) {
  try {
    const file = await FileModel.findByIdAndDelete(hash).exec();
    if (file) return { status: 200, message: "success" };
    else return { status: 404, message: "file not found" };
  } catch (e) {
    console.log(e);
    return { status: 500, message: "database error" };
  }
}