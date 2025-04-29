import cookies from "js-cookie";

export const SOPHON_AUTH_COOKIE_NAME = "DYNAMIC_JWT_TOKEN";

export const getCookieAuthToken = () => {
  return cookies.get(SOPHON_AUTH_COOKIE_NAME);
};

export { getAuthToken as getStorageAuthToken } from "@dynamic-labs/sdk-react-core";
