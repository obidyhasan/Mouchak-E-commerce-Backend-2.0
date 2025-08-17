/* eslint-disable @typescript-eslint/no-unused-vars */
import httpStatus from "http-status-codes";
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { IGallery } from "./gallery.interface";
import { GalleryService } from "./gallery.service";

const createGallery = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload: IGallery = {
      ...req.body,
      image: req.file?.path,
    };

    const gallery = await GalleryService.createGallery(payload);

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
    const gallery = await GalleryService.getAllImages();

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
    await GalleryService.deleteImage(req.params.id);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Gallery deleted successfully",
      data: null,
    });
  }
);

export const GalleryController = {
  createGallery,
  getAllImages,
  deleteImage,
};
