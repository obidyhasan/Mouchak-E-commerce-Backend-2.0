import z from "zod";
import { ORDER_STATUS, PAYMENT_STATUS } from "./order.interface";

export const createOrderZodSchema = z.object({
  carts: z.array(
    z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Cart ObjectId")
  ),
  status: z
    .enum(Object.values(ORDER_STATUS) as [string], {
      message:
        "Invalid status provided. Please choose from 'Pending', 'Picked', 'InTransit', 'Delivered', 'Cancelled', 'Confirm'.",
    })
    .default(ORDER_STATUS.Pending),
});

export const updateOrderZodSchema = z.object({
  status: z
    .enum(Object.values(ORDER_STATUS) as [string], {
      message:
        "Invalid status provided. Please choose from 'Pending', 'Picked', 'InTransit', 'Delivered', 'Cancelled', 'Confirm'.",
    })
    .optional(),
  paymentStatus: z
    .enum(Object.values(PAYMENT_STATUS) as [string], {
      message:
        "Invalid payment status provided. Please choose from 'PAID', 'UNPAID', 'REFUNDED'.",
    })
    .optional(),
});
