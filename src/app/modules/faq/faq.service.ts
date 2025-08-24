import httpStatus from "http-status-codes";
import AppError from "../../errors/AppError";
import { IFaq } from "./faq.interface";
import { FAQ } from "./faq.model";

const createFAQ = async (payload: Partial<IFaq>) => {
  const faq = await FAQ.create(payload);
  return faq;
};

const getAllFAQ = async () => {
  const faq = await FAQ.find();
  const totalFaq = await FAQ.countDocuments();

  return {
    data: faq,
    meta: {
      total: totalFaq,
    },
  };
};

const deleteFAQ = async (id: string) => {
  const isFAQExits = await FAQ.findById(id);
  if (!isFAQExits) throw new AppError(httpStatus.NOT_FOUND, "Faq not found!");

  return null;
};

export const FAQService = {
  createFAQ,
  getAllFAQ,
  deleteFAQ,
};
