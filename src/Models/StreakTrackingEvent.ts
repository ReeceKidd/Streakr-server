import * as mongoose from "mongoose";
import { Collections } from "./Collections";
import { Models } from "./Models";

export enum StreakTrackingEventType {
  LostStreak = "lost-streak",
  MaintainedStreak = "maintained-streak",
  InactiveStreak = "inactive-streak"
}

export interface StreakTrackingEvent extends mongoose.Document {
  type: StreakTrackingEvent;
  streakId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export const streakTrackingActivitySchema = new mongoose.Schema(
  {
    type: String,
    streakId: String,
    userId: String
  },
  {
    timestamps: true,
    collection: Collections.StreakTrackingEvents
  }
);

export const streakTrackingEventModel: mongoose.Model<
  StreakTrackingEvent
> = mongoose.model<StreakTrackingEvent>(
  Models.StreakTrackingEvent,
  streakTrackingActivitySchema
);
