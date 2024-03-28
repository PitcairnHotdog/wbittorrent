import { Schema } from "mongoose"
import bcrypt from "bcrypt"
import { DBConnection } from "../database.mjs"

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    }
  }
);

userSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const UserModel = DBConnection.model("Users", userSchema);

export async function dbUserSignUp(data) {
  try {
    const checkExist = await UserModel.findOne({ username: data.username }).exec();
    if (checkExist) return { status: 409, message: "username already exists" };
    const user = new UserModel(data);
    await user.save();
    return { status: 200, message: "success" };
  } catch (e) {
    console.log(e);
    return { status: 500, message: "database error" };
  }
  
}

export async function dbUserSignIn(data) {
  try {
    const user = await UserModel.findOne({ username: data.username }).exec();
    if (!user) return { status: 401, message: "invalid username or password"};
    if (bcrypt.compare(data.password, user.password)) return { status: 200, message: "success", data: user };
    else return { status: 401, message: "invalid username or password"};
  } catch (e) {
    console.log(e);
    return { status: 500, message: "database error" };
  }
}





