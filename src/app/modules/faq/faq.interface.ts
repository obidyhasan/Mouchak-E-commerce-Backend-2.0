import { Types } from "mongoose";

export interface IFaq {
  _id?: Types.ObjectId;
  title: string;
  description: string;
  createdAt?: Date;
}
