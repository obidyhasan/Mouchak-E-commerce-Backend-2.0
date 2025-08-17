import { Router } from "express";
import { OTPController } from "./otp.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { verifyOTPZodSchema } from "./otp.validation";

const router = Router();

router.post(
  "/verify",
  validateRequest(verifyOTPZodSchema),
  OTPController.verifyOTP
);

export const OTPRouter = router;
