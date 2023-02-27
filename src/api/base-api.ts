import * as AWS from "aws-sdk";
import * as yup from 'yup';
import { HttpError } from "../models/http_error";
export class BaseApi {
  inputModel;
  tableName;
  docClient;
  headers;

  constructor(tableName?, inputModel?) {
    this.inputModel = inputModel;
    this.tableName = tableName;
    this.docClient = new AWS.DynamoDB.DocumentClient();
    this.headers = {
      "content-type": "application/json",
    };
  }

  get() {
    throw "method not implemented";
  }

  post() {
    throw "method not implemented";
  }

  put() {
    throw "method not implemented";
  }

  delete() {
    throw "method not implemented";
  }

  getBody(event) {
    return JSON.parse(event.body);
  }

  fetch() {
    throw "method not implemented";
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
