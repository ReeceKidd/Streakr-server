import * as mongoose from "mongoose";
import { IStreak} from "./Streak"



export const SALT_ROUNDS = 10

export interface IUser extends mongoose.Document {
  userName: string;
  email: string;
  password: string;
  createdAt: {
    type: Date,
    required: false
  }, 
  modifiedAt: {
    type: Date,
    required: false
  }
  streaks?: IStreak[];
  profilePicture?: {
    type: String
  },
}

export const UserSchema = new mongoose.Schema(
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
    }
  },
  {
    timestamps: true,
    collection: 'Users'
  }
);

mongoose.set('useCreateIndex', true)
UserSchema.index({ userName: "text" });
UserSchema.index({ email: "text" });


export const UserModel: mongoose.Model<IUser> = mongoose.model<IUser>("User", UserSchema);