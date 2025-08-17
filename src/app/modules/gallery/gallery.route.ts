import { Role } from "./../user/user.interface";
import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { multerUpload } from "../../config/multer.config";
import { GalleryController } from "./gallery.controller";

const router = Router();

router.post(
  "/create",
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
  multerUpload.single("file"),
  GalleryController.createGallery
);
router.get("/", GalleryController.getAllImages);
router.delete(
  "/:id",
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
  GalleryController.deleteImage
);

export const GalleryRouters = router;
