import React from "react";

const InfoCard: React.FC<{
  iconSrc: string;
  alt: string;
  title: string;
  description: string;
  ImageComponent: React.ElementType;
  className?: string;
}> = ({ iconSrc, alt, title, description, ImageComponent, className }) => {
  return (
    <div
      className={`h-full relative rounded-xl bg-white border-gray-200 border-solid border-[1px] box-border flex flex-col items-center justify-center py-[2.25rem] px-[1.5rem] gap-[1.5rem] text-center text-[1.25rem] text-gray-100 font-inter ${className}`}
    >
      <ImageComponent
        className="relative max-h-full overflow-hidden"
        alt={alt}
        src={iconSrc}
        width={36}
        height={36}
      />
      <div className="self-stretch flex flex-col items-start justify-start">
        <b className="self-stretch relative leading-[1.75rem] break-words">
          {title}
        </b>
        <div className="self-stretch relative text-[1rem] leading-[1.5rem] text-dimgray break-words">
          {description}
        </div>
      </div>
    </div>
  );
};

export default InfoCard;
