import { BaseApi } from "../base-api";
import { AdminCreateUserRequest } from "aws-sdk/clients/cognitoidentityserviceprovider";

import { SignUpInputSchema } from "../../models/auth";
import { v4 } from "uuid";
import * as AWS from "aws-sdk";

const cognito = new AWS.CognitoIdentityServiceProvider();
export class AuthApi extends BaseApi {
  async SignUp(event) {
    try {
      const body = this.getBody(event);
      await SignUpInputSchema.validate(body, { abortEarly: true });
      const { email, password, name, last_name } = body;
      const userId = v4();
      const { user_pool_id } = process.env;
      if (!user_pool_id) throw "Use pool is not defined"

      const params: AdminCreateUserRequest = {
          UserPoolId: user_pool_id ,
          Username: email,
          UserAttributes: [
            {
              Name: "email",
              Value: email,
            },
            {
              Name: "email_verified",
              Value: "true",
            },
            {
              Name: "custom:id_user",
              Value: userId,
            },
            {
              Name: "custom:name",
              Value: name,
            },
            {
              Name: "custom:last_name",
              Value: last_name,
            },
          ],
          MessageAction: "SUPPRESS",
        }
      const response = await cognito
        .adminCreateUser(params)
        .promise();

      if (!response.User) throw "Error while creating the user";

      await cognito
        .adminSetUserPassword({ Password: password, UserPoolId: user_pool_id, Username: email, Permanent: true })
        .promise();

      return {
        statusCode: 200,
        body: JSON.stringify({ message: "user created successfully" }),
        headers: this.headers,
      };
    } catch (e) {
      return this.handleError(e);
    }
  }
}
