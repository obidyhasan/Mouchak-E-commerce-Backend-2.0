/* eslint-disable @typescript-eslint/no-unused-vars */
import httpStatus from "http-status-codes";
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { IFaq } from "./faq.interface";
import { FAQService } from "./faq.service";

const createFAQ = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload: IFaq = {
      ...req.body,
    };

    const faq = await FAQService.createFAQ(payload);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Faq create successfully",
      data: faq,
    });
  }
);

const getAllFAQ = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const faq = await FAQService.getAllFAQ();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Get all faq successfully",
      data: {
        data: faq.data,
        meta: faq.meta,
      },
    });
  }
);

const deleteFAQ = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    await FAQService.deleteFAQ(req.params.id);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "FAQ deleted successfully",
      data: null,
    });
  }
);

export const FAQController = {
  createFAQ,
  getAllFAQ,
  deleteFAQ,
};
