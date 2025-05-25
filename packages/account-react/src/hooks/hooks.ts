import { UserFields } from "@dynamic-labs/sdk-api-core";
import { useUserUpdateRequest } from "@dynamic-labs/sdk-react-core";

const useUpdateUserEmail = (): (() => Promise<UserFields>) => {
  const { updateUserWithModal } = useUserUpdateRequest();
  return async () => await updateUserWithModal(["email"]);
};

export { useUpdateUserEmail };
