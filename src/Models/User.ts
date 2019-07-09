import * as mongoose from "mongoose";
import { SupportedLanguages } from "../Messages/supportedLanguages";
import { Collections } from "./Collections";
import { Models } from "./Models";
import { SoloStreak } from "./SoloStreak";

export const SALT_ROUNDS = 10;

enum UserTypes {
  user = "user",
  admin = "admin"
}

export interface IMinimumUserData {
  _id: string;
  username: string;
}

export interface User extends mongoose.Document {
  _id: string;
  username: string;
  email: string;
  createdAt: Date;
  modifiedAt: Date;
  role: string;
  preferredLanguage: string;
  soloStreaks?: SoloStreak[];
  profilePicture?: {
    type: String;
  };
  friends?: string[];
}

export const userSchema = new mongoose.Schema(
  {
    username: {
      required: true,
      type: String,
      unique: true,
      trim: true
    },
    email: {
      required: true,
      type: String,
      unique: true,
      trim: true
    },
    role: {
      type: String,
      enum: [UserTypes.user, UserTypes.admin],
      default: UserTypes.user
    },
    preferredLanguage: {
      type: String,
      default: SupportedLanguages.EN
    },
    streaks: {
      type: Array,
      default: []
    },
    profilePicture: {
      type: String
    },
    friends: {
      type: Array,
      default: []
    }
  },
  {
    timestamps: true,
    collection: Collections.Users
  }
);
userSchema.index({ username: "text" });
userSchema.index({ email: "text" });

export const userModel: mongoose.Model<User> = mongoose.model<User>(
  Models.User,
  userSchema
);
