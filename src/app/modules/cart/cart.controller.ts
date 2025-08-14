/* eslint-disable @typescript-eslint/no-unused-vars */
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { NextFunction, Request, Response } from "express";
import { CartService } from "./cart.service";
import { JwtPayload } from "jsonwebtoken";

const createCart = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const cartInfo = await CartService.createCart(
      req.body,
      req.user as JwtPayload
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Create category successfully",
      data: cartInfo,
    });
  }
);

const getAllCart = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const carts = await CartService.getAllCart();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Get all carts successfully",
      data: {
        date: carts.data,
        meta: carts.meta,
      },
    });
  }
);

const getMyCart = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const carts = await CartService.getMyCart(req.user as JwtPayload);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Get my carts successfully",
      data: {
        date: carts.data,
        meta: carts.meta,
      },
    });
  }
);

export const CartController = {
  createCart,
  getAllCart,
  getMyCart,
};
