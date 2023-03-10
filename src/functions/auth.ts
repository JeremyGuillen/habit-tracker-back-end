import { AuthApi } from "../api/auth/auth-api";

const authApi = new AuthApi();

export const SignUp = async (event) => {
  return authApi.SignUp(event);
};

export const SignIn = async (event) => {
  return authApi.signIn(event);
}
