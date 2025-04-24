"use client";

import { useSophonContext } from "@sophon-labs/react";

export default async function ExampleHookUsage() {
  const { sdkHasLoaded } = useSophonContext();

  if (!sdkHasLoaded) {
    return <div>Loading...</div>;
  }

  return <div>SDK has loaded</div>;
}
