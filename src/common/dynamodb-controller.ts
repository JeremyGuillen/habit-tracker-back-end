import {DynamoDB} from 'aws-sdk';

export class DynamoDBController {
    private docClient: DynamoDB.DocumentClient;
    private tableName: string;

    constructor(tableName: string) {
        this.docClient = new DynamoDB.DocumentClient({apiVersion: '2012-08-10'});
        this.tableName = tableName;
    }

    public async putItem(item: object) {
        return await this.docClient.put({
            TableName: this.tableName,
            Item: item,
        }).promise();
    }

    public async deleteItem(key: object) {
        return await this.docClient.delete({
            TableName: this.tableName,
            Key: key
        }).promise();
    }

    public async getItem(key: object) {
        return await this.docClient.get({
            TableName: this.tableName,
            Key: key
        }).promise();
    }

    public async list() {
        return await this.docClient.scan({
            TableName: this.tableName
        }).promise();
    }

    public async query(keyCondition?: string, expressionAttributesValues?: object, filterCondition?: string,) {
        console.log(keyCondition);
        console.log(expressionAttributesValues);
        return await this.docClient.query({
            TableName: this.tableName,
            ExpressionAttributeValues: expressionAttributesValues,
            KeyConditionExpression: keyCondition,
            FilterExpression: filterCondition
        }).promise();
    }

}