import { BaseApiCRUD } from "../base-api";
import { AdminCreateUserRequest } from "aws-sdk/clients/cognitoidentityserviceprovider";
import {APIGatewayProxyEvent} from 'aws-lambda'
import { SignUpInputSchema, SignInInputSchema, CreateUserSchema } from "../../models/auth";
import { v4 } from "uuid";
import * as AWS from "aws-sdk";

const cognito = new AWS.CognitoIdentityServiceProvider();
export class AuthApi extends BaseApiCRUD {
  async SignUp(event: APIGatewayProxyEvent) {
    try {
      const body = this.getBody(event);
      await SignUpInputSchema.validate(body, { abortEarly: true });
      const { email, password, name, last_name } = body;
      const userId = v4();
      const { user_pool_id } = process.env;
      if (!user_pool_id) throw "Use pool is not defined";

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
      const user = {
        email,
        name,
        last_name,
        password,
        id_user: userId,
      }
      return await  this.post(user);
    } catch (e) {
      return this.handleError(e);
    }
  }

  async signIn(event: APIGatewayProxyEvent) {
    try {
      const body = this.getBody(event);
      await SignInInputSchema.validate(body, { abortEarly: true });
      const {
        email, password
      } = body;
      const {user_pool_id, client_id } = process.env;
      const response = await cognito.adminInitiateAuth({
        AuthFlow: 'ADMIN_NO_SRP_AUTH',
        UserPoolId: user_pool_id as string,
        ClientId: client_id as string,
        AuthParameters: {
          USERNAME: email,
          PASSWORD: password,
        },
      }).promise();
      if (response.AuthenticationResult) {
        return {
          statusCode: 200,
          body: JSON.stringify(response.AuthenticationResult),
          headers: this.headers,
        };
      } else {
        return {
          statusCode: 403,
          body: JSON.stringify({message: 'Unauthorized'}),
          headers: this.headers,
        };
      }
    } catch (e) {
      return this.handleError(e);
    }
  }
}

export const authApi = new AuthApi("HabitTrackerUsersTable", CreateUserSchema);