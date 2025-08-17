/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { OTPService } from "./otp.service";
import { sendResponse } from "../../utils/sendResponse";
import { createUserTokens } from "../../utils/userTokens";
import { setAuthCookie } from "../../utils/setCookie";

const verifyOTP = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, otp } = req.body;
    const user = await OTPService.verifyOTP(email, otp);

    const userToken = createUserTokens(user);
    setAuthCookie(res, userToken);

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "OTP verified successfully",
      data: {
        accessToken: userToken.accessToken,
      },
    });
  }
);

export const OTPController = {
  verifyOTP,
};
