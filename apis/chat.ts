import { siteUrl } from "@/config/site";
import { HttpRequest } from "@/utils/request";

const appHttpRequest = new HttpRequest(null, `${siteUrl}`);

export const listChats = async (params?: { page?: number; limit?: number }) => {
    return await appHttpRequest.get("/chats", { limit: 100, ...params });
};

export const listChatInvites = async () => {
    const res = await appHttpRequest.get("/chats/invites");
    return res;
};

export const createDirectChat = async (userId: string) => {
    const res = await appHttpRequest.post("/chats/direct", { userId });
    return res;
};

export const createGroupChat = async (data: { title: string; userIds: string[] }) => {
    const res = await appHttpRequest.post("/chats/group", data);
    return res;
};

export const inviteToGroupChat = async (chatId: string, userId: string) => {
    const res = await appHttpRequest.post(`/chats/${chatId}/invite`, { userId });
    return res;
};

export const getChatDetail = async (chatId: string) => {
    const res = await appHttpRequest.get(`/chats/${chatId}`);
    return res;
};

export const listChatMessages = async (chatId: string) => {
    const res = await appHttpRequest.get(`/chats/${chatId}/messages`);
    return res;
};

export const sendMessage = async (chatId: string, body: string) => {
    const res = await appHttpRequest.post(`/chats/${chatId}/messages`, { body });
    return res;
};

export const markChatRead = async (chatId: string) => {
    const res = await appHttpRequest.post(`/chats/${chatId}/read`, {});
    return res;
};

export const respondToChatInvite = async (chatId: string, accept: boolean) => {
    const res = await appHttpRequest.post(`/chats/${chatId}/invite/respond`, { accept });
    return res;
};

export const leaveChat = async (chatId: string) => {
    const res = await appHttpRequest.post(`/chats/${chatId}/leave`, {});
    return res;
};
export const deleteChat = async (chatId: string) => {
    const res = await appHttpRequest.del(`/chats/${chatId}`);
    return res;
};

