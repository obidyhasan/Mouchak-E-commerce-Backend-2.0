import httpStatus from "http-status-codes";
import AppError from "../../errors/AppError";
import { deleteImageFromCloudinary } from "../../config/cloudinary.config";
import { IGallery } from "./gallery.interface";
import { Gallery } from "./gallery.model";

const createGallery = async (payload: Partial<IGallery>) => {
  const image = await Gallery.create(payload);
  return image;
};

const getAllImages = async () => {
  const images = await Gallery.find();
  const totalImages = await Gallery.countDocuments();

  return {
    data: images,
    meta: {
      total: totalImages,
    },
  };
};

const deleteImage = async (id: string) => {
  const isImageExits = await Gallery.findById(id);
  if (!isImageExits)
    throw new AppError(httpStatus.NOT_FOUND, "Images not found!");

  await Gallery.findByIdAndDelete(id);

  if (isImageExits.image) {
    await deleteImageFromCloudinary(isImageExits.image);
  }

  return null;
};

export const GalleryService = {
  createGallery,
  getAllImages,
  deleteImage,
};
