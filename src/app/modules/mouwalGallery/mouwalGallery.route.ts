import { Role } from "../user/user.interface";
import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { multerUpload } from "../../config/multer.config";
import { MouwalGalleryController } from "./mouwalGallery.controller";

const router = Router();

router.post(
  "/create",
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
  multerUpload.single("file"),
  MouwalGalleryController.createGallery
);
router.get("/", MouwalGalleryController.getAllImages);
router.delete(
  "/:id",
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
  MouwalGalleryController.deleteImage
);

export const MouwalGalleryRouters = router;
