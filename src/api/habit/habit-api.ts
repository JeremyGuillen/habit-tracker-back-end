import { CallTracker } from "assert";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { v4 } from 'uuid';
import { BaseApiCRUD } from "../base-api";

export class HabitApi extends BaseApiCRUD {

  public async get(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
        const id_habit = event.pathParameters?.id_habit;
        return super.get({id_habit});
    } catch (e) {
        return this.handleError(e);
    }
  }

  public async delete(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
        const id_habit = event.pathParameters?.id_habit;
        return super.delete({id_habit});
    } catch (e) {
        return this.handleError(e);
    }
  }

  public async put(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
        const id_habit = event.pathParameters?.id_habit;
        const reqBody = this.getBody(event);
        return super.put(reqBody, {id_habit});
    } catch (e) {
        return this.handleError(e);
    }
  }

  public async post(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
      let habit = this.getBody(event);
      habit = {...habit, id_habit: v4()}
      return super.post(habit);
    } catch (e) {
        return this.handleError(e);
    }
  }

  // public async filter(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  //   try {
  //     const body = this.getBody(event);

  //   } catch (e) {
  //     return this.handleError(e);
  //   }
  // }
}