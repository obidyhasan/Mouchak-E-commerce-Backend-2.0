import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { ICart } from "./cart.interface";
import { Cart } from "./cart.model";
import AppError from "../../errors/AppError";
import { Product } from "../product/product.model";
import { User } from "../user/user.model";

const createCart = async (
  payload: Partial<ICart>,
  decodedToken: JwtPayload
) => {
  const isUserExits = await User.findById(decodedToken.userId);
  if (!isUserExits)
    throw new AppError(httpStatus.BAD_REQUEST, "User does not exits!");

  const isProductExits = await Product.findById(payload.product);
  if (!isProductExits)
    throw new AppError(httpStatus.NOT_FOUND, "Product does not exits!");

  const amount = Number(payload.quantity) * Number(isProductExits.price);

  const cart = await Cart.create({
    ...payload,
    user: decodedToken.userId,
    amount,
  });
  return cart;
};

const getAllCart = async () => {
  const carts = await Cart.find({})
    .populate("user", "name email role carts orders")
    .populate("product");

  const totalCarts = await Cart.countDocuments();

  return {
    data: carts,
    meta: {
      total: totalCarts,
    },
  };
};

const getMyCart = async (decodedToken: JwtPayload) => {
  const carts = await Cart.find({ user: decodedToken.userId })
    .populate("user", "name email role carts orders")
    .populate("product");

  const totalCarts = await Cart.countDocuments({ user: decodedToken.userId });

  return {
    data: carts,
    meta: {
      total: totalCarts,
    },
  };
};

export const CartService = {
  createCart,
  getAllCart,
  getMyCart,
};
