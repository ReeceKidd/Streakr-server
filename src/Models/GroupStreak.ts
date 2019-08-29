import * as mongoose from "mongoose";
import { Collections } from "./Collections";
import { Models } from "./Models";

export interface GroupStreak extends mongoose.Document {
  creatorId: string;
  groupName: string;
  streakName: string;
  streakDescription: string;
  members: Array<{
    userId: string;
    currentStreak: {
      startDate: Date;
      numberOfDaysInARow: number;
      endDate: Date;
    };
    pastStreaks: Array<{
      endDate: Date;
      startDate: Date;
      numberOfDaysInARow: number;
    }>;
  }>;
  timezone: string;
}

export const groupStreakSchema = new mongoose.Schema(
  {
    creatorId: {
      required: true,
      type: String
    },
    groupName: {
      required: true,
      type: String
    },
    streakName: {
      required: true,
      type: String
    },
    streakDescription: {
      required: true,
      type: String
    },
    members: [
      {
        userId: String,
        currentStreak: {
          startDate: Date,
          numberOfDaysInARow: Number,
          endDate: Date
        },
        pastStreaks: [
          {
            endDate: Date,
            startDate: Date,
            numberOfDaysInARow: Number
          }
        ]
      }
    ],
    timezone: {
      required: true,
      type: String
    }
  },
  {
    timestamps: true,
    collection: Collections.SoloStreaks
  }
);

export const groupStreakModel: mongoose.Model<GroupStreak> = mongoose.model<
  GroupStreak
>(Models.GroupStreak, groupStreakSchema);
