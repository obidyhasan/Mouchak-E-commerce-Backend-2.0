import { Types } from "mongoose";

export enum PAYMENT_METHOD {
  COD = "COD",
}

export enum ORDER_STATUS {
  Pending = "Pending",
  Picked = "Picked",
  InTransit = "InTransit",
  Delivered = "Delivered",
  Cancelled = "Cancelled",
  Confirm = "Confirm",
}

export interface IOrderLog {
  status: ORDER_STATUS;
  timestamp: Date;
  updateBy: Types.ObjectId;
  note?: string;
}

export enum PAYMENT_STATUS {
  PAID = "PAID",
  UNPAID = "UNPAID",
  REFUNDED = "REFUNDED",
}

export interface IOrder {
  _id?: Types.ObjectId;
  orderId: string;
  user: Types.ObjectId;
  carts: Types.ObjectId[];
  paymentMethod?: PAYMENT_METHOD;
  paymentStatus: PAYMENT_STATUS;
  status: ORDER_STATUS;
  statusLogs?: IOrderLog[];
  totalAmount: number;
  shippingCost: number;
  invoiceUrl?: string;
  createdAt?: Date;
}
