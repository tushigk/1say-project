import { siteUrl } from "@/config/site";
import { HttpRequest } from "@/utils/request";

const appHttpRequest = new HttpRequest(null, `${siteUrl}`);

export interface AIHuman {
    _id: string;
    image?: {
        url: string;
        blurHash?: string;
    };
    name: string;
    age?: number;
    gender: 'male' | 'female' | 'other';
    shortBio: string;
    prompt: string;
    greeting?: string;
    aiModel: string;
    isActive: boolean;
    sortOrder: number;
    createdAt: string;
    updatedAt: string;
    conversation?: AIHumanConversation;
    canChat: boolean;
}

export interface AIHumanConversation {
    _id: string;
    persona: string | AIHuman;
    user: string;
    behaviorPrompt?: string;
    lastMessageAt?: string;
    lastMessagePreview?: string;
    lastMessageRole?: 'user' | 'assistant';
    lastModel?: string;
    messageCount: number;
    createdAt: string;
    updatedAt: string;
}

export interface AIHumanMessage {
    _id: string;
    conversation: string;
    persona: string;
    user: string;
    role: 'user' | 'assistant';
    content: string;
    aiModel?: string;
    usage?: {
        promptTokens?: number;
        completionTokens?: number;
        totalTokens?: number;
    };
    createdAt: string;
    updatedAt: string;
}

export const listAIHumans = async (params?: { page?: number; limit?: number }) => {
    return await appHttpRequest.get("/ai-humans", { page: 1, limit: 20, ...params });
};

export const getAIHumanDetail = async (id: string) => {
    return await appHttpRequest.get(`/ai-humans/${id}`);
};

export const listMyAIHumanChats = async (params?: { page?: number; limit?: number }) => {
    return await appHttpRequest.get("/ai-humans/chats", { page: 1, limit: 20, ...params });
};

export const getAIHumanHistory = async (id: string, params?: { page?: number; limit?: number }) => {
    return await appHttpRequest.get(`/ai-humans/${id}/history`, { page: 1, limit: 50, ...params });
};

export const chatWithAIHuman = async (id: string, data: { message: string, behaviorPrompt?: string }) => {
    return await appHttpRequest.post(`/ai-humans/${id}/chat`, data);
};
