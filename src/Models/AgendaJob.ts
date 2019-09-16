import mongoose from "mongoose";
import { Models } from "./Models";
import { Collections } from "./Collections";
import { AgendaJob } from "@streakoid/streakoid-sdk/lib";

export type AgendaJobModel = AgendaJob & mongoose.Document;

export const agendaJobSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      index: true
    },
    data: {},
    type: {
      type: String
    },
    nextRunAt: {
      type: Date,
      default: Date.now,
      index: true
    },
    lastModifiedBy: {
      type: String
    },
    lockedAt: {
      type: Date,
      index: true
    },
    lastFinishedAt: Date
  },
  {
    collection: Collections.AgendaJobs
  }
);

agendaJobSchema.index({ "data.timezone": "text" });

export const agendaJobModel: mongoose.Model<AgendaJobModel> = mongoose.model<
  AgendaJobModel
>(Models.AgendaJob, agendaJobSchema);
