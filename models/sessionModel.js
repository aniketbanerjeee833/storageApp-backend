import { model, Schema } from "mongoose";

const sessionSchema = new Schema(
  {
     sid: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 3600,
    },
  },
  {
    strict: "throw",
  }
);

const Session = model("Session", sessionSchema);

export default Session;
