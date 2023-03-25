import { authApi } from "../api/auth/auth-api";


export const SignUp = async (event) => {
  return authApi.SignUp(event);
};

export const SignIn = async (event) => {
  return authApi.signIn(event);
}
