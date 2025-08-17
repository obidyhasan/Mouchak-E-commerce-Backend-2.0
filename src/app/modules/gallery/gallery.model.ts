import { model, Schema } from "mongoose";
import { IGallery } from "./gallery.interface";

const gallerySchema = new Schema<IGallery>(
  {
    image: { type: String },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Gallery = model<IGallery>("Gallery", gallerySchema);
