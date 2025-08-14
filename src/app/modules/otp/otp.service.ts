import httpStatus from "http-status-codes";
import { User } from "../user/user.model";
import AppError from "../../errors/AppError";
import { redisClient } from "../../config/redis.config";

const verifyOTP = async (email: string, otp: string) => {
  const user = await User.findOne({ email });

  if (!user) throw new AppError(httpStatus.NOT_FOUND, "User not found");

  const redisKey = `otp:${email}`;
  const savedOtp = await redisClient.get(redisKey);
  if (!savedOtp) throw new AppError(httpStatus.BAD_REQUEST, "Invalid OTP");

  if (savedOtp !== otp)
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid OTP");

  await Promise.all([
    User.updateOne({ email }, { isVerified: true }, { runValidators: true }),
    redisClient.del([redisKey]),
  ]);

  return user;
};

export const OTPService = {
  verifyOTP,
};
