import * as mongoose from "mongoose";
import { Collections } from "./Collections";
import { Models } from "./Models";
import { GroupStreak, GroupStreakType } from "@streakoid/streakoid-sdk/lib";
import StreakStatus from "@streakoid/streakoid-sdk/lib/StreakStatus";

export type GroupStreakModel = GroupStreak & mongoose.Document;

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
    groupStreakType: {
      required: true,
      type: GroupStreakType
    },
    status: {
      type: String,
      default: StreakStatus.live
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

export const groupStreakModel: mongoose.Model<
  GroupStreakModel
> = mongoose.model<GroupStreakModel>(Models.GroupStreak, groupStreakSchema);
