"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import useSWR, { mutate } from "swr";
import { HttpRequest } from "@/utils/request";
import { siteUrl } from "@/config/site";

export interface User {
    _id: string;
    email: string;
    username?: string;
    name?: string;
    role?: string;
    provider?: string;
    gender?: string;
    membershipExpiresAt?: string;
    avatar?: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    error: Error | null;
    login: (token: string, userData?: User) => void;
    logout: () => void;
    isAuthenticated: boolean;
    getSessionId: () => string | null;
    isCurrentSession: (sessionId: string | null) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [token, setTokenState] = useState<string | null>(null);
    const [isInitializing, setIsInitializing] = useState(true);

    const generateSessionId = useCallback(() => {
        return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${Math.random().toString(36).substr(2, 9)}`;
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("login_time");
        localStorage.removeItem("session_id");
        setTokenState(null);
        mutate(`${siteUrl}/users/me`, null, false);
    }, []);

    useEffect(() => {
        const initializeAuth = () => {
            const savedToken = localStorage.getItem("token");
            if (savedToken) {
                const loginTime = localStorage.getItem("login_time");
                const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
                const isExpired = !loginTime || (Date.now() - parseInt(loginTime) > sevenDaysInMs);

                if (isExpired) {
                    localStorage.removeItem("token");
                    localStorage.removeItem("login_time");
                    localStorage.removeItem("session_id");
                    // No need to setTokenState(null) as it's already null initially
                } else {
                    setTokenState(savedToken);
                }
            }
            setIsInitializing(false);
        };

        // Wrap the initial state setting in a microtask to avoid "cascading renders" 
        // warning while keeping initialization as fast as possible.
        Promise.resolve().then(initializeAuth);

        // Listen for force logout events from API (401 errors)
        const handleForceLogout = (event: CustomEvent) => {
            console.log("[AUTH] Force logout triggered", event.detail);
            logout();
            // Optionally show a message to the user
            if (event.detail?.message && typeof window !== "undefined") {
                alert(event.detail.message);
            }
        };

        window.addEventListener("force_logout", handleForceLogout as EventListener);

        return () => {
            window.removeEventListener("force_logout", handleForceLogout as EventListener);
        };
    }, [logout]);

    const fetcher = async () => {
        const req = new HttpRequest(token);
        return req.get("/users/me");
    };

    const { data: user, error, isLoading } = useSWR<User>(
        token ? `${siteUrl}/users/me` : null,
        fetcher,
        {
            revalidateOnFocus: false,
            shouldRetryOnError: false,
        }
    );

    const login = useCallback((newToken: string, userData?: User) => {
        // Generate and store session ID
        const sessionId = generateSessionId();
        localStorage.setItem("token", newToken);
        localStorage.setItem("login_time", Date.now().toString());
        localStorage.setItem("session_id", sessionId);
        setTokenState(newToken);
        if (userData) {
            mutate(`${siteUrl}/users/me`, userData, false);
        } else {
            mutate(`${siteUrl}/users/me`);
        }
    }, [generateSessionId]);

    // Get current session ID
    const getSessionId = useCallback((): string | null => {
        if (typeof window === "undefined") return null;
        return localStorage.getItem("session_id");
    }, []);

    // Check if session ID matches (to prevent logging out if this is the active session)
    const isCurrentSession = useCallback((sessionId: string | null): boolean => {
        const currentSessionId = getSessionId();
        return currentSessionId === sessionId;
    }, [getSessionId]);

    return (
        <AuthContext.Provider
            value={{
                user: user || null,
                token,
                isLoading: isInitializing || isLoading,
                error: error || null,
                login,
                logout,
                isAuthenticated: !!token,
                getSessionId,
                isCurrentSession,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
