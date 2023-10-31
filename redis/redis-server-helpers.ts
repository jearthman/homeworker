import kvChatClient from "./redis-clients";
import { debugLog } from "../utils/server-helpers";
import { ChatCompletionMessageParam } from "openai/resources";
import { Student, User } from "@prisma/client";

export async function setChat(
  chatId: string,
  chat: ChatCompletionMessageParam[] | null,
) {
  try {
    debugLog(
      `Setting chat ${chatId} in Redis: ${JSON.stringify(kvChatClient)}`,
    );
    kvChatClient.del(`chat:${chatId}`);
    return await kvChatClient.set(`chat:${chatId}`, chat);
  } catch (error: any) {
    console.error("Error setting chat:", error.message);
    return null;
  }
}

export async function getChat(
  chatId: string,
): Promise<ChatCompletionMessageParam[] | null> {
  try {
    debugLog(
      `Getting chat ${chatId} from Redis: ${JSON.stringify(kvChatClient)}`,
    );
    return await kvChatClient.get(`chat:${chatId}`);
  } catch (error: any) {
    console.error("Error getting chat:", error.message);
    return null;
  }
}

export async function setStudent(studentId: string, student: Student) {
  try {
    debugLog(
      `Setting student ${studentId} in Redis: ${JSON.stringify(kvChatClient)}`,
    );
    return await kvChatClient.set(`student:${studentId}`, student);
  } catch (error: any) {
    console.error("Error setting student:", error.message);
    return null;
  }
}

export async function getStudent(studentId: string): Promise<Student | null> {
  try {
    debugLog(
      `Getting student ${studentId} from Redis: ${JSON.stringify(
        kvChatClient,
      )}`,
    );
    return await kvChatClient.get(`student:${studentId}`);
  } catch (error: any) {
    console.error("Error getting student:", error.message);
    return null;
  }
}

export async function setUser(email: string, user: User) {
  try {
    debugLog(`Setting user ${email} in Redis: ${JSON.stringify(kvChatClient)}`);
    return await kvChatClient.set(`user:${email}`, user);
  } catch (error: any) {
    console.error("Error setting user:", error.message);
    return null;
  }
}

export async function getUser(email: string): Promise<User | null> {
  try {
    debugLog(
      `Getting user ${email} from Redis: ${JSON.stringify(kvChatClient)}`,
    );
    return await kvChatClient.get(`user:${email}`);
  } catch (error: any) {
    console.error("Error getting user:", error.message);
    return null;
  }
}
