/* eslint-disable @typescript-eslint/no-unused-vars */
import { redisClient } from "../../config/redis.config";
import { sendEmail } from "../../utils/sendEmail";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import crypto from "crypto";

const OTP_EXPIRATION = 5 * 60; // 5 minute

const generateOTP = (length = 6) => {
  // 6 digit otp
  const otp = crypto.randomInt(10 ** (length - 1), 10 ** length); // 100000, 1000000
  return otp;
};

const credentialsLogin = async (payload: Partial<IUser>) => {
  const isUserExits = await User.findOne({ email: payload.email });
  if (!isUserExits) {
    await User.create(payload);
  }

  const { email, ...restPayload } = payload;
  await User.findByIdAndUpdate(isUserExits?._id, restPayload, {
    new: true,
    runValidators: true,
  });

  const otp = generateOTP();
  const redisKey = `otp:${payload.email}`;

  await redisClient.set(redisKey, otp, {
    expiration: {
      type: "EX",
      value: OTP_EXPIRATION,
    },
  });

  await sendEmail({
    to: payload.email as string,
    subject: "Your Verification OTP Code",
    templateName: "otp",
    templateData: {
      otp: otp,
    },
  });
};

export const AuthService = {
  credentialsLogin,
};
