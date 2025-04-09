import { useDynamicContext } from "@dynamic-labs/sdk-react-core";

export function useSophonContext() {
  const { showDynamicUserProfile, setShowDynamicUserProfile, ...other } =
    useDynamicContext();
  return {
    ...other,
    showSophonAccountProfile: showDynamicUserProfile,
    setShowSophonAccountProfile: setShowDynamicUserProfile,
  };
}
