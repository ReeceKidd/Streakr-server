import * as mongoose from "mongoose";

export type UserModel = mongoose.Document & {
  userName: string;
  email: string;
  password: string;
  streaks: [];
  profilePicture: string;
  createdAt: Date;
  modifiedAt: Date;
};

export const SALT_ROUNDS = 10

const UserSchema = new mongoose.Schema(
  {
    userName: {
      required: true,
      type: String,
      unique: true,
      trim: true,
      index: true
    },
    email: {
      required: true,
      type: String,
      unique: true,
      trim: true,
      index: true,
      select: false
    },
    password: {
      required: true,
      type: String,
      select: false
    },
    streaks: {
      type: Array,
      default: []
    },
    profilePicture: {
      type: String
    },
    createdAt: {
      type: Date,
      required: false
    },
    modifiedAt: {
      type: Date,
      required: false
    }
  },
  {
    collection: "Users"
  }
);

UserSchema.index({ userName: "text" });
UserSchema.index({ email: "text" });

mongoose.set("useCreateIndex", true);

const User = mongoose.model("User", UserSchema);
export default User;