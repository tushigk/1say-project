import { siteUrl } from "@/config/site";
import { HttpRequest } from "@/utils/request";

const appHttpRequest = new HttpRequest(null, `${siteUrl}`);

export interface UserInfo {
    _id: string;
    username: string;
    name?: string;
}

export interface NetworkPostImage {
    _id: string;
    url: string;
}

export interface NetworkPost {
    _id: string;
    title: string;
    description: string;
    isPinned: boolean;
    likeCount: number;
    commentCount: number;
    createdBy: UserInfo;
    createdAt: string;
    updatedAt: string;
    likedByMe: boolean;
    image?: NetworkPostImage;
}

export interface NetworkPostsResponse {
    data: NetworkPost[];
    total: number;
    page: number;
    totalPages: number;
}

export interface NetworkComment {
    _id: string;
    message: string;
    postId?: string;
    createdBy: UserInfo;
    createdAt: string;
    updatedAt: string;
}

export interface NetworkCommentsResponse {
    data: NetworkComment[];
    total: number;
    page: number;
    totalPages: number;
}

export const networkApi = {
    listNetworkPosts: async (params?: { page?: number; limit?: number; search?: string }): Promise<NetworkPostsResponse> => {
        const qs = new URLSearchParams();
        if (params?.page) qs.set("page", String(params.page));
        if (params?.limit) qs.set("limit", String(params.limit));
        if (params?.search) qs.set("search", params.search);

        const url = qs.toString() ? `/network/posts?${qs.toString()}` : "/network/posts";
        return (await appHttpRequest.get(url)) as NetworkPostsResponse;
    },

    getNetworkPostDetail: async (id: string): Promise<NetworkPost> => {
        return (await appHttpRequest.get(`/network/posts/${id}`)) as NetworkPost;
    },

    createNetworkPost: async (data: { title: string; description: string; image?: string }): Promise<NetworkPost> => {
        return (await appHttpRequest.post("/network/posts", data)) as NetworkPost;
    },

    deleteNetworkPost: async (id: string): Promise<void> => {
        return await appHttpRequest.del(`/network/posts/${id}`);
    },

    listNetworkComments: async (postId: string, params?: { page?: number; limit?: number }): Promise<NetworkCommentsResponse> => {
        const qs = new URLSearchParams();
        if (params?.page) qs.set("page", String(params.page));
        if (params?.limit) qs.set("limit", String(params.limit));

        const url = qs.toString()
            ? `/network/posts/${postId}/comments?${qs.toString()}`
            : `/network/posts/${postId}/comments`;

        return (await appHttpRequest.get(url)) as NetworkCommentsResponse;
    },

    createNetworkComment: async (postId: string, data: { message: string }): Promise<NetworkComment> => {
        return (await appHttpRequest.post(`/network/posts/${postId}/comments`, data)) as NetworkComment;
    },

    deleteNetworkComment: async (commentId: string): Promise<void> => {
        return await appHttpRequest.del(`/network/comments/${commentId}`);
    },

    likeNetworkPost: async (id: string): Promise<void> => {
        return await appHttpRequest.post(`/network/posts/${id}/like`, {});
    },

    unlikeNetworkPost: async (id: string): Promise<void> => {
        return await appHttpRequest.del(`/network/posts/${id}/like`);
    },
};