import { siteUrl } from "@/config/site";
import { HttpRequest } from "@/utils/request";

const appHttpRequest = new HttpRequest(null, `${siteUrl}/users`);

export const getUserProfile = async () => {
    const res = await appHttpRequest.get("/profile");
    return res;
};

export const getPublicUserProfile = async (id: string) => {
    const res = await appHttpRequest.get(`/${id}/public`);
    return res;
};

export type UpdateMePayload = Partial<{
    gender: "male" | "female" | "other";
    interestedIn: "male" | "female" | "both" | "all";
    age: number;
    name: string;
    birthDate: string;
}>;

export const updateMe = async (data: UpdateMePayload) => {
    const res = await appHttpRequest.put("/me", data);
    return res;
};

export const updateUser = async (
    id: string,
    data: UpdateMePayload
) => {
    const res = await appHttpRequest.put(`/${id}`, data);
    return res;
};
