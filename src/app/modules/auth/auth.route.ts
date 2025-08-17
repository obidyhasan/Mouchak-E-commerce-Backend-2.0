import { AuthController } from "./auth.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { loginUserZodSchema } from "./auth.validation";
import { Router } from "express";

const router = Router();

router.post(
  "/login",
  validateRequest(loginUserZodSchema),
  AuthController.credentialsLogin
);
router.post("/logout", AuthController.logout);

export const AuthRouters = router;
