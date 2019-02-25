import * as mongoose from 'mongoose';
import { IStreak } from './Streak';
import { SupportedLanguages } from '../Messages/supportedLanguages';
import { Collections } from './Collections';
import { Models } from './Models';

export const SALT_ROUNDS = 10;

enum UserTypes {
  user = 'user',
  admin = 'admin',
}

export interface IMinimumUserData {
  _id: string,
  userName: string
}

export interface IUser extends mongoose.Document {
  userName: string;
  email: string;
  password: string;
  createdAt: {
    type: Date,
    required: false,
  };
  modifiedAt: {
    type: Date,
    required: false,
  };
  streaks?: IStreak[];
  profilePicture?: {
    type: String,
  };
  role: string;
  preferredLanguage: string;
}

export const userSchema = new mongoose.Schema(
  {
    userName: {
      required: true,
      type: String,
      unique: true,
      trim: true,
      index: true,
    },
    email: {
      required: true,
      type: String,
      unique: true,
      trim: true,
      index: true,
    },
    password: {
      required: true,
      type: String,
    },
    streaks: {
      type: Array,
      default: [],
    },
    profilePicture: {
      type: String,
    },
    role: {
      type: String,
      enum: [UserTypes.user, UserTypes.admin],
      default: UserTypes.user,
    },
    preferredLanguage: {
      type: String,
      default: SupportedLanguages.EN
    }
  },
  {
    timestamps: true,
    collection: Collections.Users,
  },
);

mongoose.set('useCreateIndex', true);
userSchema.index({ userName: 'text' });
userSchema.index({ email: 'text' });

export const userModel: mongoose.Model<IUser> = mongoose.model<IUser>(Models.User, userSchema);
