import { Router } from "express";
import { UserController } from "./user.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { updateUserZodSchema } from "./user.validation";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "./user.interface";

const router = Router();

// Get All Users
router.get(
  "/",
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
  UserController.getAllUsers
);

// Get My Profile
router.get("/me", checkAuth(...Object.values(Role)), UserController.getMe);

// User Update
router.patch(
  "/:id",
  validateRequest(updateUserZodSchema),
  checkAuth(...Object.values(Role)),
  UserController.updateUser
);

export const UserRouters = router;
