import { useEffect, useState } from "react";
import { isValidPartner } from "./utils";

export const PartnerGate = ({
  partnerId,
  sandboxDisabled,
  children,
}: {
  partnerId: string;
  sandboxDisabled: boolean;
  children: React.ReactNode;
}) => {
  const [isValid, setIsValid] = useState(true);
  useEffect(() => {
    isValidPartner(partnerId, sandboxDisabled).then((response) => {
      setIsValid(response);
    });
  }, [partnerId]);

  if (!isValid) {
    return (
      <>
        <div
          style={{
            display: "fixed",
            top: 0,
            left: 0,
            right: 0,
            textAlign: "center",
            width: "100vw !important",
            backgroundColor: "red",
            color: "white",
            padding: "10px",
          }}
        >
          Invalid partner ID
        </div>
        {children}
      </>
    );
  }

  return children;
};
