import { Schema } from "mongoose";
import { DBConnection } from "../database.mjs";
import { usersRouter } from "../routes/users.mjs";

const userFavouriteSchema = new Schema(
  {
    torrent_id: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: false
    },
    username: {
      type: String,
      required: true
    }
  }
);

const UserFavouriteModel = DBConnection.model("UserFavourites", userFavouriteSchema);

export async function dbAddUserFavourite(data) {
  try {
    const check = await UserFavouriteModel.findOne({ torrent_id: data.torrent_id, username: data.username }).exec();
    if (check) return { status: 409, message: "already added to favourite" };
    const doc = new UserFavouriteModel(data);
    await doc.save();
    return { status: 200, message: "success" };
  } catch (e) {
    console.log(e);
    return { status: 500, message: "database error" };
  }
}

export async function dbRetrieveUserFavouritePaginated(username, page) {
  try {
    const limit = 100;
    const fileList = await UserFavouriteModel.find({  }).select("torrent_id title description").skip((page - 1) * limit).limit(limit).exec();
    return { status: 200, message: "success", data: fileList};
  } catch (e) {
    console.log(e);
    return { status: 500, message: "database error" };
  }
}

export async function dbDeleteUserFavourite(torrent_id, username) {
  try {
    const check = await UserFavouriteModel.findOne({ torrent_id: torrent_id, username: username }).exec();
    if (!check) return { status: 404, message: "torrent not found" };
    await UserFavouriteModel.findByIdAndDelete(check._id).exec();
    return { status: 200, message: "success" };
  } catch (e) {
    console.log(e);
    return { status: 500, message: "database error" };
  }
}