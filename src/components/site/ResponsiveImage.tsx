import type { ImgHTMLAttributes } from "react";

export type LocalImage = {
  src: string;
  srcSet?: string;
  width: number;
  height: number;
  sizes?: string;
};

export function ResponsiveImage({
  asset,
  alt,
  ...props
}: ImgHTMLAttributes<HTMLImageElement> & { asset: LocalImage; alt: string }) {
  return (
    <img
      src={asset.src}
      srcSet={asset.srcSet}
      width={asset.width}
      height={asset.height}
      sizes={asset.sizes}
      alt={alt}
      decoding="async"
      {...props}
    />
  );
}
