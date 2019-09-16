import * as mongoose from "mongoose";
import { Collections } from "./Collections";
import { Models } from "./Models";
import { GroupMemberStreak } from "@streakoid/streakoid-sdk/lib";

export type GroupMemberStreakModel = GroupMemberStreak & mongoose.Document;

export const groupMemberStreakSchema = new mongoose.Schema(
  {
    userId: {
      required: true,
      type: String,
      index: true
    },
    groupStreakId: {
      required: true,
      type: String,
      index: true
    },
    timezone: {
      required: true,
      type: String
    },
    completedToday: {
      type: Boolean,
      default: false
    },
    active: {
      type: Boolean,
      default: false
    },
    activity: {
      type: Array,
      default: []
    },
    currentStreak: {
      startDate: {
        type: Date,
        default: undefined
      },
      numberOfDaysInARow: {
        type: Number,
        default: 0
      },
      endDate: {
        type: Date,
        default: undefined
      }
    },
    pastStreaks: {
      type: Array,
      default: []
    }
  },
  {
    timestamps: true,
    collection: Collections.GroupMemberStreaks
  }
);

export const groupMemberStreakModel: mongoose.Model<
  GroupMemberStreakModel
> = mongoose.model<GroupMemberStreakModel>(
  Models.GroupMemberStreak,
  groupMemberStreakSchema
);
