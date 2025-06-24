import type React from "react";

const BlueLink = ({
  href,
  LinkComponent,
  children,
}: {
  href: string;
  LinkComponent: React.ElementType;
  children: React.ReactNode;
}) => {
  return (
    <b className="self-stretch relative text-[1rem] [text-decoration:underline] tracking-[-0.01em] leading-[1.5rem] text-royal-blue">
      <LinkComponent href={href} target="_blank">
        {children}
      </LinkComponent>
    </b>
  );
};

export default BlueLink;
