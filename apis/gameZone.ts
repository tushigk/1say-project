import { siteUrl } from "@/config/site";
import { HttpRequest } from "@/utils/request";

const appHttpRequest = new HttpRequest(null, `${siteUrl}`);

export interface GameZone {
    _id: string;
    image?: {
        id: string;
        url: string;
        blurHash?: string;
    } | null;
    title: string;
    description?: string | null;
    type: string;
    level: string;
    responseMode: string;
    isActive: boolean;
    sortOrder: number;
    createdAt: string;
    updatedAt: string;
}

export interface GameZoneListResponse {
    data: GameZone[];
    total: number;
    page: number;
    totalPages: number;
}

export interface GameZonePlayPayload {
    playerName: string;
    level: string;
}

export interface GameZonePlayResponse {
    data: {
        game: GameZone;
        playerName: string;
        prompt: string;
        response: string;
        selectedLevel: string;
        model: string;
        usage: {
            promptTokens?: number;
            completionTokens?: number;
            totalTokens?: number;
        };
    };
}

export const listGameZones = async (params?: { page?: number; limit?: number; type?: string; level?: string }): Promise<GameZoneListResponse> => {
    return await appHttpRequest.get("/game-zones", { page: 1, limit: 20, ...params });
};

export const getGameZoneDetail = async (id: string): Promise<{ data: GameZone }> => {
    return await appHttpRequest.get(`/game-zones/${id}`);
};

export const playGameZone = async (id: string, data: GameZonePlayPayload): Promise<GameZonePlayResponse> => {
    return await appHttpRequest.post(`/game-zones/${id}/play`, data);
};
