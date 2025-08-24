import { Types } from "mongoose";

export enum PStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  STOCK_OUT = "STOCK_OUT",
}

export interface IProduct {
  _id?: Types.ObjectId;
  name: string;
  slug: string;
  category: string;
  price: number;
  previousPrice: number;
  costPrice?: number;
  status: PStatus;
  description: string;
  image?: string;
  createdAt?: Date;
}
