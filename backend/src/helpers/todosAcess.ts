import { UpdateTodoRequest } from './../requests/UpdateTodoRequest';
import { CreateTodoRequest } from './../requests/CreateTodoRequest';
import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import * as uuid from 'uuid'

const AWSXRay = require('aws-xray-sdk')
const XAWS = AWSXRay.captureAWS(AWS)
const logger = createLogger('TodosAccess')

// TODO: Implement the dataLayer logic
export class TodosAccess {

    constructor(
        private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly todosTable = process.env.TODOS_TABLE,
        // private readonly todosTableIndex = process.env.TODOS_CREATED_AT_INDEX 
        ) {
    }

    async getTodosForUser(userId: string): Promise<TodoItem[]> {
        logger.info(`getTodosForUser by ${userId}`);
        const result = await this.docClient.query({
            TableName: this.todosTable,
            KeyConditionExpression: "userId = :userId",
            ExpressionAttributeValues: {
                ":userId": userId
            },
            ScanIndexForward: false
        }).promise();

        const items = result.Items
        console.log("db: ", result);
        return items as TodoItem[]
    }

    async createTodoForUser(userId: string, newTodo: CreateTodoRequest): Promise<string> {
        const todoId = uuid.v4();
        logger.info(`createTodoForUser with todoId: ${todoId}`);
        const newTodoWithAdditionalInfo = {
            userId: userId,
            todoId: todoId,
            createAt: new Date().toISOString(),
            done: false,
            ...newTodo
        }

        await this.docClient.put({
            TableName: this.todosTable,
            Item: newTodoWithAdditionalInfo
        }).promise();

        return todoId;

    }

    async deleteTodo(todoId: string, userId: string) {
        logger.info(`deleteTodo with todoId: ${todoId} and userId: ${userId}`);
        await this.docClient.delete({
            TableName: this.todosTable,
            Key: {
                userId: userId,
                todoId: todoId
            }
        }).promise();
    
    }

    async updateTodo(userId: String, todoId: string, updatedTodo: UpdateTodoRequest){
        logger.info(`updateTodo with todoId: ${userId} and with todoId: ${todoId}`)
        await this.docClient.update({
            TableName: this.todosTable,
            Key: {
                "todoId": todoId,
                "userId": userId
            },
            UpdateExpression: "set #todoName = :name, done = :done, dueDate = :dueDate",
            ExpressionAttributeNames: {
                "#todoName": "name"
            },
            ExpressionAttributeValues: {
                ":name": updatedTodo.name,
                ":done": updatedTodo.done,
                ":dueDate": updatedTodo.dueDate
            }
        }).promise()

    }
}