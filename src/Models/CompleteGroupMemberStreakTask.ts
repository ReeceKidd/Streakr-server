import * as mongoose from "mongoose";
import { Models } from "./Models";
import { Collections } from "./Collections";
import { StreakTypes } from "./TypesOfStreak";

export interface CompleteGroupMemberStreakTask extends mongoose.Document {
  streakId: string;
  userId: string;
  groupStreakId: string;
  groupMemberStreakId: string;
  taskCompleteTime: Date;
  taskCompleteDay: string;
  streakType: StreakTypes;
}

export const completeGroupMemberStreakTaskSchema = new mongoose.Schema(
  {
    userId: {
      required: true,
      type: String
    },
    groupStreakId: {
      required: true,
      type: String
    },
    groupMemberStreakId: {
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

completeGroupMemberStreakTaskSchema.index({ userId: 1, streakId: 1 });

export const completeGroupMemberStreakTaskModel: mongoose.Model<
  CompleteGroupMemberStreakTask
> = mongoose.model<CompleteGroupMemberStreakTask>(
  Models.CompleteGroupMemberStreakTask,
  completeGroupMemberStreakTaskSchema
);
