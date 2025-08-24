import { Router } from "express";
import { UserRouters } from "../modules/user/user.route";
import { AuthRouters } from "../modules/auth/auth.route";
import { ProductRouters } from "../modules/product/product.route";
import { OrderRouters } from "../modules/order/order.route";
import { OTPRouter } from "../modules/otp/otp.route";
import { StatsRouters } from "../modules/stats/stats.route";
import { GalleryRouters } from "../modules/gallery/gallery.route";
import { CartRouter } from "../modules/cart/cart.route";
import { FAQRouters } from "../modules/faq/faq.route";

export const router = Router();

const moduleRouters = [
  {
    path: "/user",
    router: UserRouters,
  },
  {
    path: "/auth",
    router: AuthRouters,
  },
  {
    path: "/product",
    router: ProductRouters,
  },
  {
    path: "/order",
    router: OrderRouters,
  },
  {
    path: "/otp",
    router: OTPRouter,
  },
  {
    path: "/stats",
    router: StatsRouters,
  },
  {
    path: "/gallery",
    router: GalleryRouters,
  },
  {
    path: "/faq",
    router: FAQRouters,
  },
  {
    path: "/cart",
    router: CartRouter,
  },
];

moduleRouters.forEach((route) => {
  router.use(route.path, route.router);
});
