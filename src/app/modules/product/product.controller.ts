/* eslint-disable @typescript-eslint/no-unused-vars */
import httpStatus from "http-status-codes";
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { IProduct } from "./product.interface";
import { ProductService } from "./product.service";

const createProduct = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload: IProduct = {
      ...req.body,
      image: req.file?.path,
    };

    const product = await ProductService.createProduct(payload);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Product create successfully",
      data: product,
    });
  }
);

const getAllProduct = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const products = await ProductService.getAllProduct();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Get all product successfully",
      data: {
        data: products.data,
        meta: products.meta,
      },
    });
  }
);

const getSingleProduct = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const product = await ProductService.getSingleProduct(req.params.slug);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Get single product successfully",
      data: product,
    });
  }
);

const updateProduct = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload: IProduct = {
      ...req.body,
      image: req.file?.path,
    };

    const product = await ProductService.updateProduct(req.params.id, payload);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Product update successfully",
      data: product,
    });
  }
);

const deleteProduct = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    await ProductService.deleteProduct(req.params.id);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Product deleted successfully",
      data: null,
    });
  }
);

export const ProductController = {
  createProduct,
  getAllProduct,
  getSingleProduct,
  updateProduct,
  deleteProduct,
};
