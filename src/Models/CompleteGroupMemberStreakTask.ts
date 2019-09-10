import * as mongoose from "mongoose";
import { Models } from "./Models";
import { Collections } from "./Collections";
import { TypesOfStreak } from "./TypesOfStreak";

export interface CompleteGroupMemberStreakTask extends mongoose.Document {
  streakId: string;
  userId: string;
  taskCompleteTime: Date;
  taskCompleteDay: string;
  streakType: TypesOfStreak;
}

export const completeGroupMemberStreakTaskSchema = new mongoose.Schema(
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
    collection: Collections.CompleteGroupMemberStreakTasks
  }
);

completeGroupMemberStreakTaskSchema.index(
  { userId: 1, streakId: 1 },
  { unique: true }
);

export const completeGroupMemberStreakTaskModel: mongoose.Model<
  CompleteGroupMemberStreakTask
> = mongoose.model<CompleteGroupMemberStreakTask>(
  Models.CompleteSoloStreakTask,
  completeGroupMemberStreakTaskSchema
);
