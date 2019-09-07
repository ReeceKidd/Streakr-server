import * as mongoose from "mongoose";
import { Collections } from "./Collections";
import { Models } from "./Models";
import { StreakTrackingEventType } from "./StreakTrackingEvent";

export interface SoloStreak extends mongoose.Document {
  userId: string;
  streakName: string;
  streakDescription: string;
  completedToday: boolean;
  active: boolean;
  activity: Array<{
    type: StreakTrackingEventType;
    time: Date;
  }>;
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
  timezone: string;
}

export const soloStreakSchema = new mongoose.Schema(
  {
    userId: {
      required: true,
      type: String,
      index: true
    },
    name: {
      required: true,
      type: String,
      index: true
    },
    description: {
      type: String
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

export const soloStreakModel: mongoose.Model<SoloStreak> = mongoose.model<
  SoloStreak
>(Models.SoloStreak, soloStreakSchema);
