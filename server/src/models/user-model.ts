import { Schema, Types, model } from "mongoose";
import { DEFAULT_ROLE_ID } from "../config/env";
import CounterModel from "./counter-model";

interface IUser {
  idSimple: number;
  email: string;
  nickname: string;
  nicknameSlug: string;
  bio: string;
  location: string;
  links: Array<object>;
  interests: Array<string>;
  avatarUrl: string;
  banExpires: string;
  lastOnline: string;
  password?: string;
  _id?: Types.ObjectId;
  role: object | string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    idSimple: {
      type: Number,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      minlength: 4,
      maxlength: 99,
      unique: [true, "Этот логин уже используется"],
    },
    nickname: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 32,
      unique: [true, "Этот никнейм уже используется"],
    },
    nicknameSlug: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      required: true,
      minlength: 0,
      maxlength: 400,
    },
    location: {
      type: String,
      required: true,
      minlength: 0,
      maxlength: 99,
    },
    links: {
      type: [
        {
          _id: false,
          name: { type: String, minlength: 1, maxlength: 32 },
          link: { type: String, minlength: 1, maxlength: 199 },
        },
      ],
      required: true,
      validate: {
        validator: arr => arr.length <= 10,
        message: "Не больше 10 ссылок",
      },
    },
    interests: {
      type: [
        {
          type: String,
          minlength: 1,
          maxlength: 32,
        },
      ],
      required: true,
      validate: {
        validator: arr => arr.length <= 10,
        message: "Не больше 10 интересов",
      },
    },
    avatarUrl: {
      type: String,
      required: true,
      minlength: 0,
      maxlength: 199,
    },
    banExpires: {
      type: String,
      required: true,
      minlength: 0,
      maxlength: 199,
    },
    lastOnline: {
      type: String,
      required: true,
      minlength: 0,
      maxlength: 199,
    },
    password: {
      type: String,
      required: true,
      minlength: 12,
      maxlength: 99,
      select: false,
    },
    role: {
      type: Schema.Types.ObjectId,
      required: [true, "Недопустимая группа"],
      ref: "role",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

userSchema.virtual("id").get(function () {
  return String(this._id);
});

userSchema.set("toJSON", {
  virtuals: true,
  transform: (_doc, ret: IUser) => {
    delete ret._id;
    delete ret.password;
    return ret;
  },
});

userSchema.pre("validate", function (next) {
  if (this.isNew) {
    this.role = new Types.ObjectId(DEFAULT_ROLE_ID);
    this.nickname = String(this._id);
    this.bio = "none";
    this.location = "none";
    this.links = [];
    this.interests = [];
    this.avatarUrl = "none";
    this.banExpires = "none";
    this.lastOnline = "none";
  }
  next();
});

userSchema.pre("save", async function (next) {
  if (this.isNew) {
    const counter = await CounterModel.findOneAndUpdate(
      { _id: "users" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true },
    );
    this.idSimple = counter.seq;
    this.nicknameSlug = `${this.nicknameSlug}-${this.nickname}`;
  }
  next();
});

export default model<IUser>("user", userSchema);
