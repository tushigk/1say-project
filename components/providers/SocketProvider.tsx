"use client";

import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { usePathname } from "next/navigation";
import { siteUrl } from "@/config/site";
import { useAuth } from "./AuthProvider";

interface SocketContextType {
    socket: Socket | null;
    isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
    socket: null,
    isConnected: false,
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
    const { token, isAuthenticated, logout, isCurrentSession } = useAuth();
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const socketRef = useRef<Socket | null>(null);
    const pathname = usePathname();
    const publicRoutes = ['/login', '/register', '/age-gate', '/privacy', '/plans'];

    // Adjust state during render if authentication is lost. 
    // This avoids cascading renders from useEffect and keeps the UI in sync.
    if ((!isAuthenticated || !token) && (socket !== null || isConnected !== false)) {
        setSocket(null);
        setIsConnected(false);
    }

    useEffect(() => {
        // Skip socket connection on public routes
        const isPublicRoute = publicRoutes.includes(pathname) || pathname.startsWith('/payment');

        if (!isAuthenticated || !token || isPublicRoute) {
            return;
        }

        const socketInstance = io(siteUrl, {
            auth: {
                token: token,
            },
        });

        socketInstance.on("connect", () => {
            console.log("[SOCKET] Connected at", pathname);
            setIsConnected(true);
        });

        socketInstance.on("disconnect", () => {
            console.log("[SOCKET] Disconnected");
            setIsConnected(false);
        });

        // Listen for force logout events when another user logs in with the same account
        socketInstance.on("force_logout", (data: { sessionId?: string; message?: string }) => {
            console.log("[SOCKET] Force logout received", data);
            // If a specific session ID is provided, only logout if it's not the current session
            if (data.sessionId) {
                if (!isCurrentSession(data.sessionId)) {
                    // Another session logged in, logout this session
                    logout();
                    // Optionally show a message to the user
                    if (typeof window !== "undefined") {
                        alert(data.message || "Another user has logged in with your account. You have been logged out.");
                    }
                }
            } else {
                // No session ID specified, logout anyway (backend determined this session should be invalidated)
                logout();
                if (typeof window !== "undefined") {
                    alert(data.message || "Another user has logged in with your account. You have been logged out.");
                }
            }
        });

        // Listen for session invalidated events
        socketInstance.on("session_invalidated", (data: { sessionId?: string; message?: string }) => {
            console.log("[SOCKET] Session invalidated", data);
            if (data.sessionId) {
                if (!isCurrentSession(data.sessionId)) {
                    logout();
                    if (typeof window !== "undefined") {
                        alert(data.message || "Your session has been invalidated.");
                    }
                }
            } else {
                logout();
                if (typeof window !== "undefined") {
                    alert(data.message || "Your session has been invalidated.");
                }
            }
        });

        socketRef.current = socketInstance;

        // Wrap state update in a microtask to avoid synchronous setState warnings
        // while the effect is still running.
        Promise.resolve().then(() => {
            setSocket(socketInstance);
        });

        return () => {
            socketInstance.off("force_logout");
            socketInstance.off("session_invalidated");
            socketInstance.disconnect();
            socketRef.current = null;

            // Cleanup state in a microtask
            Promise.resolve().then(() => {
                setSocket(null);
                setIsConnected(false);
            });
        };
    }, [isAuthenticated, token, logout, isCurrentSession, pathname]);

    return (
        <SocketContext.Provider value={{ socket, isConnected }}>
            {children}
        </SocketContext.Provider>
    );
};
