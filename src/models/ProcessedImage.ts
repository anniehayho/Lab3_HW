import { ImageItem } from "./ImageItem";

export interface ProcessedImage extends ImageItem {
    aiTags: string[];
  }