import { Schema, Types, model } from "mongoose";
import CounterModel from "./counter-model";

interface IBlog {
  _id?: Types.ObjectId;
  idSimple: number;
  title: string;
  blogSlug: string;
  author: object;
  coverUrl: string;
  hidden: boolean;
  pinned: boolean;
  postsCount: number;
  viewsCount: number;
  ratingCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const blogSchema = new Schema<IBlog>(
  {
    idSimple: {
      type: Number,
      unique: true,
    },
    title: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 50,
    },
    blogSlug: {
      type: String,
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    coverUrl: {
      type: String,
      required: true,
      minlength: 0,
      maxlength: 199,
    },
    hidden: {
      type: Boolean,
      required: true,
    },
    pinned: {
      type: Boolean,
      required: true,
    },
    postsCount: {
      type: Number,
      required: true,
    },
    viewsCount: {
      type: Number,
      required: true,
    },
    ratingCount: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

blogSchema.virtual("id").get(function () {
  return String(this._id);
});

blogSchema.set("toJSON", {
  virtuals: true,
  transform: (_doc, ret: IBlog) => {
    delete ret._id;
    return ret;
  },
});

blogSchema.pre("save", async function (next) {
  if (this.isNew) {
    const counter = await CounterModel.findOneAndUpdate(
      { _id: "blogs" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true },
    );
    this.idSimple = counter.seq;
    this.blogSlug = `${this.idSimple}-${this.blogSlug}`;
  }
  next();
});

export default model<IBlog>("blog", blogSchema);
