import { TodoItem } from './../models/TodoItem';
import { TodosAccess } from './todosAcess'
import { AttachmentUtils } from './attachmentUtils';
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'

// TODO: Implement businessLogic
const todosAccess = new TodosAccess();
const attachmentUtils = new AttachmentUtils();

export async function getTodosForUser(userId:string): Promise<TodoItem[]>{
    return await todosAccess.getTodosForUser(userId);
}

export async function createTodoForUser(userId: string, newTodo: CreateTodoRequest): Promise<string>{
    return await todosAccess.createTodoForUser(userId, newTodo);
}

export async function deleteTodo(todoId: string, userId: string){
    return await todosAccess.deleteTodo(todoId, userId);
}

export async function updateTodo(userId: String, todoId: string, updatedTodo: UpdateTodoRequest){
    return await todosAccess.updateTodo(userId, todoId, updatedTodo);
}

export async function createAttachmentPresignedUrl (todoId: string): Promise<string> {
    return await attachmentUtils.createAttachmentPresignedUrl(todoId);
}

export async function updateTodoAttachmentUrl(todoId: string, attachmentUrl: string, userId: string){
    return await attachmentUtils.updateTodoAttachmentUrl(todoId, attachmentUrl, userId);
}