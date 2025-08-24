import { Role } from "./../user/user.interface";
import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { FAQController } from "./faq.controller";

const router = Router();

router.post(
  "/create",
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
  FAQController.createFAQ
);
router.get("/", FAQController.getAllFAQ);
router.delete(
  "/:id",
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
  FAQController.deleteFAQ
);

export const FAQRouters = router;
