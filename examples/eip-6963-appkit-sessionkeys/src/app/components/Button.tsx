import React from "react";

const Button = ({
  children,
  onClick,
  variant = "primary",
  className = "",
  disabled = false,
}: {
  children: React.ReactNode;
  onClick: () => void;
  variant?: "primary" | "secondary";
  className?: string;
  disabled?: boolean;
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`rounded-full bg-gradient-to-r from-[#ebf4ff] via-[#cce4ff] to-[#cce4ff] flex items-center justify-start p-0.5 cursor-pointer
        ${
          variant === "primary"
            ? "bg-whitesmoke text-gray-900 hover:bg-whitesmoke/90 hover:shadow-md active:bg-whitesmoke/80 active:shadow-inner active:scale-98 active:translate-y-0.5"
            : "bg-gray-200 text-gray-900 hover:bg-gray-300 hover:shadow-md active:bg-gray-200 active:shadow-inner active:scale-98 active:translate-y-0.5"
        }
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        ${className}
      `}
    >
      <div className="rounded-full bg-whitesmoke flex items-center justify-center px-4 py-2 sm:px-6 sm:py-2.5 md:px-8 md:py-3">
        <span className="relative tracking-wide leading-6 font-medium text-base sm:text-lg md:text-xl">
          {children}
        </span>
      </div>
    </button>
  );
};

export default Button;
