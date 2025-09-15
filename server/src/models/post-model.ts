import { Schema, Types, model } from "mongoose";
import CounterModel from "./counter-model";

interface IPost {
  _id?: Types.ObjectId;
  idSimple: number;
  title: string;
  postSlug: string;
  body: string;
  blog: object;
  author: object;
  hidden: boolean;
  pinned: boolean;
  tags: Array<string>;
  likesCount: number;
  dislikesCount: number;
  whoLike: Array<string>;
  whoDislike: Array<string>;
  createdAt: Date;
  updatedAt: Date;
}

const postSchema = new Schema<IPost>(
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
    postSlug: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 9999,
    },
    blog: {
      type: Schema.Types.ObjectId,
      ref: "blog",
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    hidden: {
      type: Boolean,
      required: true,
    },
    pinned: {
      type: Boolean,
      required: true,
    },
    tags: {
      type: [
        {
          type: String,
          minlength: 1,
          maxlength: 32,
        },
      ],
      required: true,
      default: [],
      validate: {
        validator: arr => arr.length <= 5,
        message: "Не больше 5 тегов",
      },
    },
    likesCount: {
      type: Number,
      required: true,
    },
    dislikesCount: {
      type: Number,
      required: true,
    },
    whoLike: {
      type: [String],
      required: true,
      default: [],
    },
    whoDislike: {
      type: [String],
      required: true,
      default: [],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

postSchema.virtual("id").get(function () {
  return String(this._id);
});

postSchema.set("toJSON", {
  virtuals: true,
  transform: (_doc, ret: IPost) => {
    delete ret._id;
    return ret;
  },
});

postSchema.pre("save", async function (next) {
  if (this.isNew) {
    const counter = await CounterModel.findOneAndUpdate(
      { _id: "posts" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true },
    );
    this.idSimple = counter.seq;
    this.postSlug = `${this.idSimple}-${this.postSlug}`;
  }
  next();
});

export default model<IPost>("post", postSchema);
