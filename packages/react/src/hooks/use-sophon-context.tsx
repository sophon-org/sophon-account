import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import "@dynamic-labs/wallet-connector-core";

type OriginalReturnType = ReturnType<typeof useDynamicContext>;
interface SophonReturnType
  extends Omit<
    OriginalReturnType,
    "showDynamicUserProfile" | "setShowDynamicUserProfile"
  > {
  showSophonAccountProfile: boolean;
  setShowSophonAccountProfile: (show: boolean) => void;
}

export function useSophonContext(): SophonReturnType {
  const { showDynamicUserProfile, setShowDynamicUserProfile, ...other } =
    useDynamicContext();
  return {
    ...other,
    showSophonAccountProfile: showDynamicUserProfile,
    setShowSophonAccountProfile: setShowDynamicUserProfile,
  };
}
