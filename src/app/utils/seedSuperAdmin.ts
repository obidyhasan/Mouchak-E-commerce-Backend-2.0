/* eslint-disable no-console */
import { envVars } from "../config/env";
import { IUser, Role } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";

export const seedSuperAdmin = async () => {
  try {
    const isSuperAdminExists = await User.findOne({
      email: envVars.SUPER_ADMIN_EMAIL,
    });

    if (isSuperAdminExists) {
      return;
    }

    const payload: Partial<IUser> = {
      name: "Super Admin",
      role: Role.SUPER_ADMIN,
      email: envVars.SUPER_ADMIN_EMAIL,
    };

    const superAdmin = await User.create(payload);
    if (envVars.NODE_ENV === "development") {
      console.log("Super Admin created successfully - ", superAdmin);
    }
  } catch (error) {
    console.log(error);
  }
};
