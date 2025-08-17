import httpStatus from "http-status-codes";
import AppError from "../../errors/AppError";
import { IProduct } from "./product.interface";
import { Product } from "./product.model";
import { deleteImageFromCloudinary } from "../../config/cloudinary.config";

const createProduct = async (payload: Partial<IProduct>) => {
  const isProductExits = await Product.findOne({ name: payload.name });
  if (isProductExits)
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Product with this name already exits!"
    );

  const product = await Product.create(payload);
  return product;
};

const getAllProduct = async () => {
  const products = await Product.find();
  const totalProduct = await Product.countDocuments();

  return {
    data: products,
    meta: {
      total: totalProduct,
    },
  };
};

const getSingleProduct = async (slug: string) => {
  const product = await Product.findOne({ slug });

  if (!product) throw new AppError(httpStatus.NOT_FOUND, "Product not found!");

  return {
    product,
  };
};

const updateProduct = async (id: string, payload: Partial<IProduct>) => {
  const isProductExits = await Product.findById(id);
  if (!isProductExits)
    throw new AppError(httpStatus.NOT_FOUND, "Product not found!");

  const updateProduct = await Product.findByIdAndUpdate(id, payload, {
    new: true,
  });

  if (payload.image && isProductExits.image) {
    await deleteImageFromCloudinary(isProductExits.image);
  }

  return updateProduct;
};

const deleteProduct = async (id: string) => {
  const isProductExits = await Product.findById(id);
  if (!isProductExits)
    throw new AppError(httpStatus.NOT_FOUND, "Product not found!");

  await Product.findByIdAndDelete(id);

  if (isProductExits.image) {
    await deleteImageFromCloudinary(isProductExits.image);
  }

  return null;
};

export const ProductService = {
  createProduct,
  getAllProduct,
  getSingleProduct,
  updateProduct,
  deleteProduct,
};
