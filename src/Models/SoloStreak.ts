import * as mongoose from "mongoose";
import { Collections } from "./Collections";
import { Models } from "./Models";
import { SoloStreak } from "@streakoid/streakoid-sdk/lib";

export type SoloStreakModel = SoloStreak & mongoose.Document;

export const soloStreakSchema = new mongoose.Schema(
  {
    userId: {
      required: true,
      type: String,
      index: true
    },
    streakName: {
      required: true,
      type: String,
      index: true
    },
    streakDescription: {
      type: String,
      default: ""
    },
    numberOfMinutes: {
      type: Number
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
    collection: Collections.SoloStreaks
  }
);

export const soloStreakModel: mongoose.Model<SoloStreakModel> = mongoose.model<
  SoloStreakModel
>(Models.SoloStreak, soloStreakSchema);
