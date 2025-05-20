import React from "react";

const Button = ({
  children,
  onClick,
  variant = "primary",
}: {
  children: React.ReactNode;
  onClick: () => void;
  variant?: "primary" | "secondary";
}) => {
  return (
    <button
      onClick={onClick}
      className={`rounded-[144px] [background:linear-gradient(72.44deg,_#ebf4ff_12%,_#cce4ff_72.12%)] flex flex-row items-center justify-start p-[0.125rem] ${
        variant === "primary"
          ? "bg-whitesmoke text-gray-900 hover:bg-whitesmoke/90 hover:shadow-md active:bg-whitesmoke/80 active:shadow-inner active:scale-[0.98] active:translate-y-[1px]"
          : "bg-gray-200 text-gray-900 hover:bg-gray-300 hover:shadow-md active:bg-gray-200 active:shadow-inner active:scale-[0.98] active:translate-y-[1px]"
      }`}
    >
      <div className="rounded-[144px] bg-whitesmoke flex flex-row items-center justify-start p-[1.375rem]">
        <div className="flex flex-row items-center justify-center py-[0rem] px-[0.75rem]">
          <div className="relative tracking-[0.01em] leading-[1.5rem] font-medium">
            {children}
          </div>
        </div>
      </div>
    </button>
  );
};

export default Button;
