/* eslint-disable no-console */

import { envVars } from "../config/env";
import { IUser, Role } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";

export const seedAdmin = async () => {
  try {
    const isAdminExists = await User.findOne({
      email: envVars.ADMIN_EMAIL,
    });

    if (isAdminExists) {
      return;
    }

    const payload: Partial<IUser> = {
      name: "Admin",
      role: Role.ADMIN,
      email: envVars.ADMIN_EMAIL,
    };

    const admin = await User.create(payload);
    if (envVars.NODE_ENV === "development") {
      console.log("Admin created successfully - ", admin);
    }
  } catch (error) {
    console.log(error);
  }
};
