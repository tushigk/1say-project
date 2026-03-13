import { siteUrl } from "@/config/site";
import { HttpRequest } from "@/utils/request";
import { User } from "@/components/providers/AuthProvider";

const appHttpRequest = new HttpRequest(null, siteUrl);

export interface AuthResponse {
  token: string;
  user?: User;
  message?: string;
}

export const login = async (data: Record<string, unknown>): Promise<AuthResponse> => {
  const res = await appHttpRequest.post("/auth/login", data);
  return res as AuthResponse;
};

export const register = async (data: Record<string, unknown>): Promise<AuthResponse> => {
  const res = await appHttpRequest.post("/auth/register", data);
  return res as AuthResponse;
};
