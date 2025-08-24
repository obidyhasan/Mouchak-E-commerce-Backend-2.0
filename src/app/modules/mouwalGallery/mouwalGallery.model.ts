import { model, Schema } from "mongoose";
import { IMouwalGallery } from "./mouwalGallery.interface";

const gallerySchema = new Schema<IMouwalGallery>(
  {
    image: { type: String },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const MouwalGallery = model<IMouwalGallery>(
  "MouwalGallery",
  gallerySchema
);
