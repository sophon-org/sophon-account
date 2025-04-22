import cookies from "js-cookie";

export const SOPHON_AUTH_COOKIE_NAME = "DYNAMIC_JWT_TOKEN";

export const getAuthToken = () => {
  return cookies.get(SOPHON_AUTH_COOKIE_NAME);
};
