import httpStatus from "http-status-codes";
import AppError from "../../errors/AppError";
import { User } from "./user.model";
import { JwtPayload } from "jsonwebtoken";
import { IUser, Role } from "./user.interface";

const getAllUsers = async () => {
  const users = await User.find({});
  const totalUser = await User.countDocuments();

  return {
    data: users,
    meta: {
      total: totalUser,
    },
  };
};

const getMe = async (userId: string) => {
  const me = await User.findById(userId);
  if (!me) throw new AppError(httpStatus.NOT_FOUND, "User does not exists!");
  return me;
};

const updateUser = async (
  userId: string,
  payload: Partial<IUser>,
  decodedToken: JwtPayload
) => {
  if (decodedToken.role === Role.USER) {
    if (userId !== decodedToken.userId) {
      throw new AppError(httpStatus.FORBIDDEN, "You are not authorized!");
    }
  }

  const isUserExits = await User.findById(userId);
  if (!isUserExits)
    throw new AppError(httpStatus.NOT_FOUND, "User does not exists!");

  if (
    (decodedToken.role === Role.ADMIN &&
      isUserExits.role === Role.SUPER_ADMIN) ||
    (decodedToken.role === Role.USER && isUserExits.role === Role.ADMIN)
  ) {
    throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized!");
  }

  /**
   * only admin/superAdmin can update -> role
   */

  if (payload.role) {
    if (decodedToken.role === Role.USER)
      throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
  }

  const updateUser = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  });

  return updateUser;
};

export const UserService = {
  getAllUsers,
  getMe,
  updateUser,
};
