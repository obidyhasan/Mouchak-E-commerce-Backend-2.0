/* eslint-disable @typescript-eslint/no-unused-vars */
import httpStatus from "http-status-codes";
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { IMouwalGallery } from "./mouwalGallery.interface";
import { MouwalGalleryService } from "./mouwalGallery.service";

const createGallery = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload: IMouwalGallery = {
      ...req.body,
      image: req.file?.path,
    };

    const gallery = await MouwalGalleryService.createGallery(payload);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Gallery create successfully",
      data: gallery,
    });
  }
);

const getAllImages = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const gallery = await MouwalGalleryService.getAllImages();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Get all gallery successfully",
      data: {
        data: gallery.data,
        meta: gallery.meta,
      },
    });
  }
);

const deleteImage = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    await MouwalGalleryService.deleteImage(req.params.id);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Gallery deleted successfully",
      data: null,
    });
  }
);

export const MouwalGalleryController = {
  createGallery,
  getAllImages,
  deleteImage,
};
