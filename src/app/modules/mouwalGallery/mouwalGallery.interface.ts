import { Types } from "mongoose";

export interface IMouwalGallery {
  _id?: Types.ObjectId;
  image?: string;
  createdAt?: Date;
}
