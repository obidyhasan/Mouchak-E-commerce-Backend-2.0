import { model, Schema } from "mongoose";
import { IUser, Role } from "./user.interface";

const userSchema = new Schema<IUser>(
  {
    name: { type: String },
    email: { type: String, required: true, unique: true },
    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.USER,
    },
    division: { type: String },
    phone: { type: String },
    address: { type: String },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const User = model<IUser>("User", userSchema);
