import * as mongoose from "mongoose";
import { Collections } from "./Collections";
import { Models } from "./Models";

export interface GroupStreak extends mongoose.Document {
  creatorId: string;
  streakName: string;
  streakDescription: string;
  numberOfMinutes: number;
  members: { memberId: string; groupMemberStreakId: string }[];
  timezone: string;
}

export const groupStreakSchema = new mongoose.Schema(
  {
    creatorId: {
      required: true,
      type: String
    },
    streakName: {
      required: true,
      type: String
    },
    streakDescription: {
      type: String
    },
    numberOfMinutes: {
      type: Number
    },
    members: {
      type: [],
      default: []
    },
    timezone: {
      required: true,
      type: String
    }
  },
  {
    timestamps: true,
    collection: Collections.GroupStreaks
  }
);

export const groupStreakModel: mongoose.Model<GroupStreak> = mongoose.model<
  GroupStreak
>(Models.GroupStreak, groupStreakSchema);
