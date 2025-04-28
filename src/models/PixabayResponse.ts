import { ImageItem } from "./ImageItem";

export interface PixabayResponse {
    total: number;
    totalHits: number;
    hits: ImageItem[];
  }