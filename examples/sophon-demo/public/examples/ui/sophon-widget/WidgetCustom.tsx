"use client";

import { SophonWidget } from "@sophon-labs/react";
import { RabbitIcon } from "lucide-react";

export default function ExampleComponent() {
  const customComponent = (
    <span
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
      }}
    >
      <RabbitIcon /> Custom Component
    </span>
  );

  return (
    <SophonWidget
      variant="modal"
      className="partner-custom-button"
      label={customComponent}
    />
  );
}
