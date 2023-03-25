import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import * as AWS from "aws-sdk";
import * as yup from 'yup';
import { DynamoDBController } from "../common/dynamodb-controller";
import { HttpError } from "../models/http_error";
export class BaseApi {
  inputModel: yup.AnyObjectSchema;
  tableName: string;
  idKeyName: string;
  docClient: AWS.DynamoDB.DocumentClient;
  headers: object;

  constructor(tableName?, inputModel?) {
    this.inputModel = inputModel;
    this.tableName = tableName;
    this.docClient = new AWS.DynamoDB.DocumentClient();
    this.headers = {
      "content-type": "application/json",
    };
  }

  getBody(event) {
    return JSON.parse(event.body);
  }

  protected handleError(error: unknown) {
    if (error instanceof yup.ValidationError) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          errors: error.errors,
        }),
        headers: this.headers,
      };
    }
    if (error instanceof HttpError) {
      return {
        statusCode: error.statusCode,
        body: error.message,
        headers: this.headers,
      };
    }

    if (error instanceof SyntaxError) {
      return {
        statusCode: 400,
        headers: this.headers,
        body: JSON.stringify({ error: `invalid request body format: ${error.message}` }),
      };
    }

    throw error;
  }
}

export class BaseApiCRUD {
  inputModel: yup.AnyObjectSchema;
  tableName: string;
  headers: any;
  dynamoController: DynamoDBController;

  constructor(tableName: string, inputModel: yup.AnyObjectSchema) {
    this.inputModel = inputModel;
    this.tableName = tableName;
    this.dynamoController = new DynamoDBController(this.tableName);
  }

  public async get(key: object): Promise<APIGatewayProxyResult> {
    try {
      if (!key) {
        throw new Error("key is not defined");
      }
      const output = await this.dynamoController.getItem(key);

      if (!output.Item) {
        return {
          statusCode: 404,
          body: JSON.stringify({message: "Not founded any value with provided arguments"}),
          headers: this.headers,
        }
      }

      return {
        statusCode: 200,
        body: JSON.stringify({
          items: output.Item
        }),
        headers: this.headers,        
      };
      
    } catch (e) {
      return this.handleError(e);
    }
  }

  public async list(): Promise<APIGatewayProxyResult> {
    try {
      const output = await this.dynamoController.list();
      return {
        statusCode: 200,
        body: JSON.stringify(output.Items),
        headers: this.headers,
      }
    } catch (e) {
      return this.handleError(e);
    }
  }

  public async delete(key: object): Promise<APIGatewayProxyResult> {
    try {
      if (!key) {
        throw new Error("missing required arguments");
      }
      const output = await this.dynamoController.getItem(key);

      if (!output.Item) {
        throw new Error("Could not find item to be deleted");
      }

      await this.dynamoController.deleteItem(key);

      return {
        statusCode: 200,
        body: JSON.stringify(output.Item),
        headers: this.headers,
      };
      
    } catch (e) {
      return this.handleError(e);
    }
  }

  public async post(item: object): Promise<APIGatewayProxyResult> {
    try {
      if (!item) { 
        throw new Error('Missing required parameters');
      }
      await this.inputModel.validate(item, {abortEarly: true});
      await this.dynamoController.putItem(item);
      return {
        statusCode: 200,
        body: JSON.stringify(item),
        headers: this.headers,
      };
    } catch (e) {
      return this.handleError(e);
    }
  }

  public async put(item: object, key: object): Promise<APIGatewayProxyResult> {
    try {
      if (!item) { 
        throw new Error('Missing required parameters');
      }
      await this.inputModel.validate(item, {abortEarly: true});

      const output = await this.dynamoController.getItem(key);
      
      if (!output.Item) {
        throw new Error('Could not find item to be updated');
      }

      await this.dynamoController.putItem(item);
      return {
        statusCode: 200,
        body: JSON.stringify(item),
        headers: this.headers,
      };
    } catch (e) {
      return this.handleError(e);
    }
  }


  protected getBody(event) {
    return JSON.parse(event.body);
  }

  protected handleError(error: unknown) {
    if (error instanceof yup.ValidationError) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          errors: error.errors,
        }),
        headers: this.headers,
      };
    }
    if (error instanceof HttpError) {
      return {
        statusCode: error.statusCode,
        body: error.message,
        headers: this.headers,
      };
    }

    if (error instanceof SyntaxError) {
      return {
        statusCode: 400,
        headers: this.headers,
        body: JSON.stringify({ error: `invalid request body format: ${error.message}` }),
      };
    }

    throw error;
  }
}
