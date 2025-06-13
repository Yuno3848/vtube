import mongoose, { Schema } from "mongoose";

const subscriptionSchema = new Schema(
  {
    subscriber: {
      type: Schema.Types.ObjectId, //one who is SUBSCRIBING
      ref: "User",
    },
    channel: {
      type: Schema.Types.ObjectId, // one to whom SUBSCRIBER is SUBSCRIBING
      ref: "User",
    },
  },
  { timestamps: true }
);
export const Subscription = mongoose.model("Subscription", subscriptionSchema);
