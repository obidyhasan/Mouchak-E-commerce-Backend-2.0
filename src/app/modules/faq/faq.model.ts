import { model, Schema } from "mongoose";
import { IFaq } from "./faq.interface";

const gallerySchema = new Schema<IFaq>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const FAQ = model<IFaq>("FAQ", gallerySchema);
