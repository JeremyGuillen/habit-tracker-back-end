import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { v4 } from 'uuid';
import { FilterHabitSchema, HabitSchema } from "../../models/habits";
import { BaseApiCRUD } from "../base-api";

export class HabitApi extends BaseApiCRUD {

  public async get(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
        console.log(event.headers);
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
      const claims = this.getUserAttributes(event);
      return {
        statusCode: 200,
        body: JSON.stringify(claims ?? {message: "Could not find user attributes"}),
      }
      let habit = this.getBody(event);
      habit = {...habit, id_habit: v4()}
      return super.post(habit);
    } catch (e) {
        return this.handleError(e);
    }
  }

  public async filterItems(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
      const body = this.getBody(event);
      await FilterHabitSchema.validate(body, {abortEarly: true});
      const expressionAttributes = {
        ':user': body.id_user,
      };
      const filterExpression = "contains(id_user, :user)";
      console.log(expressionAttributes);
      return super.filter(undefined, expressionAttributes, filterExpression);
    } catch (e) {
      return this.handleError(e);
    }
  }
}

export const habitApi = new HabitApi("HabitTrackerHabitsTable", HabitSchema)