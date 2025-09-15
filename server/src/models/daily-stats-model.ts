import { Schema, Types, model } from "mongoose";

interface IDailyStats {
  _id?: Types.ObjectId;
  date: Date;
  postsCount: number;
  usersCount: number;
}

const dailyStatsSchema = new Schema<IDailyStats>(
  {
    date: {
      type: Date,
      required: true,
      unique: true,
    },
    postsCount: {
      type: Number,
      required: true,
    },
    usersCount: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

dailyStatsSchema.virtual("id").get(function () {
  return String(this._id);
});

dailyStatsSchema.set("toJSON", {
  virtuals: true,
  transform: (_doc, ret: IDailyStats) => {
    delete ret._id;
    return ret;
  },
});

export default model<IDailyStats>("stat", dailyStatsSchema);
