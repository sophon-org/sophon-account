import Link from "next/link";
import type React from "react";

const InfoCard: React.FC<{
  iconSrc: string;
  alt: string;
  title: string;
  description: string;
  ImageComponent: React.ElementType;
  url: string;
  className?: string;
}> = ({ iconSrc, alt, title, description, ImageComponent, className, url }) => {
  return (
    <Link
      href={url}
      target="_blank"
      className={`h-full relative rounded-xl bg-white border-gray-200 border-solid border-[1px] box-border flex flex-col items-center justify-center
        py-6 px-4 gap-4 text-center text-base sm:py-8 sm:px-6 sm:gap-6 sm:text-lg md:py-9 md:px-8 md:gap-8 md:text-xl text-gray-100 font-inter ${className}`}
    >
      <ImageComponent
        className="relative max-h-full overflow-hidden w-9 h-9 sm:w-12 sm:h-12 md:w-16 md:h-16"
        alt={alt}
        src={iconSrc}
        width={64}
        height={64}
      />
      <div className="self-stretch flex flex-col items-start justify-start">
        <b className="self-stretch relative leading-tight break-words text-lg sm:text-xl md:text-2xl">
          {title}
        </b>
        <div className="self-stretch relative text-sm sm:text-base md:text-lg leading-snug text-dimgray break-words">
          {description}
        </div>
      </div>
    </Link>
  );
};

export default InfoCard;
