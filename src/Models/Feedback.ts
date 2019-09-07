import * as mongoose from "mongoose";
import { Collections } from "./Collections";
import { Models } from "./Models";

export interface Feedback extends mongoose.Document {
  userId: string;
  pageUrl: string;
  username: string;
  userEmail: string;
  feedback: string;
}

export const feedbackSchema = new mongoose.Schema(
  {
    userId: {
      required: true,
      type: String
    },
    pageUrl: {
      required: true,
      type: String
    },
    username: {
      required: true,
      type: String
    },
    userEmail: {
      required: true,
      type: String
    },
    feedback: {
      required: true,
      type: String
    }
  },
  {
    timestamps: true,
    collection: Collections.Feedback
  }
);

export const feedbackModel: mongoose.Model<Feedback> = mongoose.model<Feedback>(
  Models.Feedback,
  feedbackSchema
);
