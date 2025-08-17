import { Types } from "mongoose";

export enum Role {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  USER = "USER",
}

export interface IUser {
  _id?: Types.ObjectId;
  name?: string;
  email: string;
  phone?: string;
  division?: string;
  address?: string;
  role: Role;
  createdAt?: Date;
}
