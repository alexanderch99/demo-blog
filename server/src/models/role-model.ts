import { Schema, Types, model } from "mongoose";

interface IRole {
  name: string;
  displayName: string;
  isAdmin: boolean;
  priority: number;
  permissions: Array<string>;
  secured: boolean;
  _id?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const roleSchema = new Schema<IRole>(
  {
    name: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 32,
      unique: true,
    },
    displayName: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 32,
      unique: [true, "Отображаемое имя должно быть уникальным"],
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    priority: {
      type: Number,
      required: true,
      unique: [true, "Приоритет должен быть уникальным"],
    },
    permissions: {
      type: [String],
      required: true,
      validate: {
        validator: function (arr) {
          return arr.length >= 1 && arr.length <= 99;
        },
        message: "Размер списка прав должен быть от 1 до 99",
      },
    },
    secured: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

roleSchema.virtual("id").get(function () {
  return String(this._id);
});

roleSchema.set("toJSON", {
  virtuals: true,
  transform: (_doc, ret: IRole) => {
    delete ret._id;
    return ret;
  },
});

export default model<IRole>("role", roleSchema);
