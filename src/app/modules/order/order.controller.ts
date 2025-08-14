/* eslint-disable @typescript-eslint/no-unused-vars */
import httpStatus from "http-status-codes";
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { OrderService } from "./order.service";
import { JwtPayload } from "jsonwebtoken";

const createOrder = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const order = await OrderService.createOrder(
      req.user as JwtPayload,
      req.body
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Order create successfully",
      data: order,
    });
  }
);

const getAllOrders = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const orders = await OrderService.getAllOrders();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Get all orders successfully",
      data: {
        data: orders.data,
        meta: orders.meta,
      },
    });
  }
);

const getMyOrders = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const orders = await OrderService.getMyOrders(req.user as JwtPayload);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Get my order successfully",
      data: {
        data: orders.data,
        meta: orders.meta,
      },
    });
  }
);

const updateOrder = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const orders = await OrderService.updateOrder(
      req.params.id,
      req.body,
      req.user as JwtPayload
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Order update successfully",
      data: orders,
    });
  }
);

const deleteOrder = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    await OrderService.deleteOrder(req.params.id, req.user as JwtPayload);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Order delete successfully",
      data: null,
    });
  }
);

const getInvoiceDownloadUrl = catchAsync(
  async (req: Request, res: Response) => {
    const result = await OrderService.getInvoiceDownloadUrl(req.params.orderId);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Invoice download URL retrieved successfully",
      data: result,
    });
  }
);

export const OrderController = {
  createOrder,
  getAllOrders,
  getMyOrders,
  updateOrder,
  deleteOrder,
  getInvoiceDownloadUrl,
};

// const createCategory = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     sendResponse(res, {
//       success: true,
//       statusCode: httpStatus.OK,
//       message: "Create category successfully",
//       data: null,
//     });
//   }
// );
