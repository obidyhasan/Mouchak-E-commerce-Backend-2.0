import httpStatus from "http-status-codes";
import AppError from "../../errors/AppError";
import { deleteImageFromCloudinary } from "../../config/cloudinary.config";
import { IMouwalGallery } from "./mouwalGallery.interface";
import { MouwalGallery } from "./mouwalGallery.model";

const createGallery = async (payload: Partial<IMouwalGallery>) => {
  const image = await MouwalGallery.create(payload);
  return image;
};

const getAllImages = async () => {
  const images = await MouwalGallery.find();
  const totalImages = await MouwalGallery.countDocuments();

  return {
    data: images,
    meta: {
      total: totalImages,
    },
  };
};

const deleteImage = async (id: string) => {
  const isImageExits = await MouwalGallery.findById(id);
  if (!isImageExits)
    throw new AppError(httpStatus.NOT_FOUND, "Images not found!");

  await MouwalGallery.findByIdAndDelete(id);

  if (isImageExits.image) {
    await deleteImageFromCloudinary(isImageExits.image);
  }

  return null;
};

export const MouwalGalleryService = {
  createGallery,
  getAllImages,
  deleteImage,
};
