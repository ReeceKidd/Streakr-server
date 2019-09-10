import * as mongoose from "mongoose";
import { Models } from "./Models";
import { Collections } from "./Collections";

export enum TypesOfStreak {
  soloStreak = "solo-streak"
}

export interface CompleteSoloStreakTask extends mongoose.Document {
  streakId: string;
  userId: string;
  taskCompleteTime: Date;
  taskCompleteDay: string;
  streakType: TypesOfStreak;
}

export const completeSoloStreakTaskSchema = new mongoose.Schema(
  {
    streakId: {
      required: true,
      type: String
    },
    userId: {
      required: true,
      type: String
    },
    taskCompleteTime: {
      required: true,
      type: Date
    },
    taskCompleteDay: {
      required: true,
      type: String
    },
    streakType: {
      required: true,
      type: String
    }
  },
  {
    timestamps: true,
    collection: Collections.CompleteSoloStreakTasks
  }
);

completeSoloStreakTaskSchema.index(
  { userId: 1, streakId: 1, taskCompleteDay: 1 },
  { unique: true }
);

export const completeSoloStreakTaskModel: mongoose.Model<
  CompleteSoloStreakTask
> = mongoose.model<CompleteSoloStreakTask>(
  Models.CompleteSoloStreakTask,
  completeSoloStreakTaskSchema
);
