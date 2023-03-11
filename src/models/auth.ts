import * as yup from "yup";

export const SignUpInputSchema = yup.object({
  email: yup.string().required(),
  password: yup.string().required(),
  name: yup.string().required(),
  last_name: yup.string().required(),
});

export const SignInInputSchema = yup.object({
  email: yup.string().required(),
  password: yup.string().required(),
});
