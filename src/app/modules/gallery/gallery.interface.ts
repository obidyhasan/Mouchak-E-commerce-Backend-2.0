import { Types } from "mongoose";

export interface IGallery {
  _id?: Types.ObjectId;
  image?: string;
  createdAt?: Date;
}
