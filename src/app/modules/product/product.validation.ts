import z from "zod";
import { PStatus } from "./product.interface";

export const createProductZodSchema = z.object({
  name: z
    .string("Name required and must be string")
    .min(1, { message: "Name must be at least 1 characters" }),
  category: z
    .string("Category required and must be string")
    .min(1, { message: "Category must be at least 1 characters" }),
  price: z.number("NewPrice required and must be number"),
  costPrice: z.number("CostPrice must be number").optional(),
  status: z
    .enum(Object.values(PStatus) as [string], {
      message:
        "Invalid status provided. Please choose from 'ACTIVE', 'INACTIVE', 'STOCK_OUT'.",
    })
    .optional(),
  description: z.string("Description must be string"),
});

export const updateProductZodSchema = z.object({
  name: z
    .string("Name must be string")
    .min(1, { message: "Name must be at least 1 characters" })
    .optional(),
  category: z
    .string("Category required and must be string")
    .min(1, { message: "Category must be at least 1 characters" })
    .optional(),
  image: z.string().optional(),
  price: z.number("NewPrice must be number").optional(),
  costPrice: z.number("CostPrice must be number").optional(),
  status: z
    .enum(Object.values(PStatus) as [string], {
      message:
        "Invalid status provided. Please choose from 'ACTIVE', 'INACTIVE', 'STOCK_OUT'.",
    })
    .optional(),
  description: z.string("Description must be string").optional(),
});
