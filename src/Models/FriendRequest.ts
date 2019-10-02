import * as mongoose from "mongoose";
import { Collections } from "./Collections";
import { Models } from "./Models";
import { FriendRequest } from "@streakoid/streakoid-sdk/lib";

export type FriendRequestModel = FriendRequest & mongoose.Document;

export const friendRequestSchema = new mongoose.Schema(
  {
    requesterId: {
      required: true,
      type: String
    },
    requesteeId: {
      required: true,
      type: String
    },
    status: {
      required: true,
      type: String
    }
  },
  {
    timestamps: true,
    collection: Collections.Feedback
  }
);

export const friendRequestModel: mongoose.Model<
  FriendRequestModel
> = mongoose.model<FriendRequestModel>(
  Models.FriendRequest,
  friendRequestSchema
);
