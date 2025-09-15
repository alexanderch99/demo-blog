import { Schema, model } from "mongoose";

interface ICounter {
  _id: string;
  seq: number;
}

const counterSchema = new Schema<ICounter>(
  {
    _id: String,
    seq: { type: Number, default: 0 },
  },
  {
    timestamps: false,
    versionKey: false,
  },
);

export default model<ICounter>("counter", counterSchema);
