import * as mongoose from "mongoose";
import { Collections } from "./Collections";
import { Models } from "./Models";

export interface StripeCustomer extends mongoose.Document {
  _id: string;
  email: string;
  token: string;
}

export const stripeCustomerSchema = new mongoose.Schema(
  {
    email: {
      required: true,
      type: String,
      unique: true,
      trim: true
    },
    token: {
      required: true,
      type: String
    },
    customerId: {
      required: true,
      type: String
    }
  },
  {
    timestamps: true,
    collection: Collections.StripeCustomers
  }
);

export const stripeCustomerModel: mongoose.Model<
  StripeCustomer
> = mongoose.model<StripeCustomer>(Models.StripeCustomer, stripeCustomerSchema);
