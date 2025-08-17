import z from "zod";

export const verifyOTPZodSchema = z.object({
  otp: z.string("OTP require and must be string"),
  email: z.email({ message: "Invalid email address format." }),
});
