import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { v4 } from 'uuid';
import { FilterHabitSchema, HabitSchema } from "../../models/habits";
import { BaseApiCRUD } from "../base-api";

export class HabitApi extends BaseApiCRUD {

  public async get(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
        const id_habit = event.pathParameters?.id_habit;
        const attributes = this.getUserAttributes(event);
        if (!attributes) {
          throw new Error("Missing required attributes");
        }
        return super.get({id_habit: id_habit, id_user: attributes.id_user});
    } catch (e) {
        return this.handleError(e);
    }
  }

  public async delete(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
        const id_habit = event.pathParameters?.id_habit;
        const attributes = this.getUserAttributes(event);
        if (!attributes) {
          throw new Error("Missing required attributes");
        }
        return super.delete({id_habit, id_user: attributes.id_user});
    } catch (e) {
        return this.handleError(e);
    }
  }

  public async put(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
        const id_habit = event.pathParameters?.id_habit;
        const attributes = this.getUserAttributes(event);
        if (!attributes) {
          throw new Error("Missing required attributes");
        }
        const reqBody = this.getBody(event);
        return {statusCode: 500, body: JSON.stringify({message: "Testing error message"})}
        // return super.put(reqBody, {id_habit: id_habit, id_user: attributes.id_user});
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

  public async filterItems(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
      const body = this.getBody(event);
      const attributes = this.getUserAttributes(event);
      if (!attributes) {
        throw new Error("Could not retrieve user attributes");
      }
      await FilterHabitSchema.validate(body, {abortEarly: true});
      const expressionAttributes = {
        ':u': attributes.id_user,
      };
      const keyExpression = "id_user = :u";
      return super.filter(keyExpression, expressionAttributes);
    } catch (e) {
      return this.handleError(e);
    }
  }

  public async listHabits(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
      return super.list();
    } catch (e) {
      return this.handleError(e);
    }
  }
}

export const habitApi = new HabitApi("HabitTrackerHabitsTable", HabitSchema)