
import data from './placeholder-images.json';

export type ImagePlaceholder = {
  id: string;
  description: string;
  imageUrl: string;
  imageHint: string;
};

// ضمان تصدير المصفوفة بشكل آمن لمنع خطأ .find() على undefined
export const PlaceHolderImages: ImagePlaceholder[] = data?.placeholderImages || [];
