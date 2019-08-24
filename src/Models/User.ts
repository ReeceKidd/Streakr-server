import * as mongoose from "mongoose";
import { Collections } from "./Collections";
import { Models } from "./Models";
import { SoloStreak } from "./SoloStreak";

export enum UserTypes {
  basic = "basic",
  premium = "premium",
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
  type: string;
  friends: string[];
  soloStreaks?: SoloStreak[];
  profilePicture?: {
    type: string;
  };
  stripe?: {
    token?: {
      type: string;
    };
    customer?: {
      type: string;
    };
    subscription?: {
      type: string;
    };
  };
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
    type: {
      type: String,
      enum: [UserTypes.basic, UserTypes.premium, UserTypes.admin],
      default: UserTypes.basic
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
    },
    stripe: {
      token: {
        type: String
      },
      customer: {
        type: String
      },
      subscription: {
        type: String,
        default: undefined
      }
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
