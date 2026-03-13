import { siteUrl } from "@/config/site";

export class HttpRequest {
    private baseUrl: string;
    private token: string | null;

    constructor(token: string | null = null, baseUrl: string = siteUrl) {
        this.baseUrl = baseUrl;
        this.token = token;
    }

    private async request(path: string, options: RequestInit = {}) {
        const url = `${this.baseUrl}${path}`;
        const headers = new Headers(options.headers);

        const currentToken = this.token || (typeof window !== "undefined" ? localStorage.getItem("token") : null);

        if (currentToken) {
            headers.set("Authorization", `Bearer ${currentToken}`);
        }

        if (!(options.body instanceof FormData)) {
            headers.set("Content-Type", "application/json");
        }

        const response = await fetch(url, {
            ...options,
            headers,
        });

        const data = await response.json();

        if (!response.ok) {
            // Handle 401 Unauthorized - token is invalid, logout user
            if (response.status === 401) {
                // Dispatch a custom event to trigger logout
                if (typeof window !== "undefined") {
                    window.dispatchEvent(new CustomEvent("force_logout", { 
                        detail: { 
                            message: "Your session has expired or another user has logged in with your account.",
                            reason: "unauthorized"
                        } 
                    }));
                }
            }
            
            // Handle 500 Internal Server Error - check if it's a session-related error
            if (response.status === 500) {
                const errorMessage = data?.message || data?.error || "";
                const errorString = typeof errorMessage === "string" ? errorMessage.toLowerCase() : "";
                
                // Check if error message indicates session/session invalid issues
                // Common indicators: "invalid", "session", "expired", "хүчингүй", "Нэвтрэх"
                if (
                    errorString.includes("invalid") ||
                    errorString.includes("session") ||
                    errorString.includes("expired") ||
                    errorString.includes("хүчингүй") ||
                    errorString.includes("нэвтрэх") ||
                    errorString.includes("unauthorized") ||
                    errorString.includes("authentication")
                ) {
                    // Dispatch a custom event to trigger logout
                    if (typeof window !== "undefined") {
                        window.dispatchEvent(new CustomEvent("force_logout", { 
                            detail: { 
                                message: data?.message || "Your session has expired or been invalidated.",
                                reason: "server_error"
                            } 
                        }));
                    }
                }
            }
            
            throw data || new Error("Something went wrong");
        }

        return data;
    }

    async get(path: string, params?: Record<string, unknown>) {
        let queryString = "";
        if (params) {
            const filteredParams = Object.fromEntries(
                Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== "")
            );
            if (Object.keys(filteredParams).length > 0) {
                queryString = "?" + new URLSearchParams(filteredParams as Record<string, string>).toString();
            }
        }
        return this.request(`${path}${queryString}`, { method: "GET" });
    }

    async post(path: string, body: unknown) {
        return this.request(path, {
            method: "POST",
            body: body instanceof FormData ? body : JSON.stringify(body),
        });
    }

    async put(path: string, body: unknown) {
        return this.request(path, {
            method: "PUT",
            body: body instanceof FormData ? body : JSON.stringify(body),
        });
    }

    async del(path: string) {
        return this.request(path, { method: "DELETE" });
    }
}
