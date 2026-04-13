'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface NavItemProps {
    icon: React.ReactNode;
    label: string;
    isActive?: boolean;
    onClick?: () => void;
    badge?: string;
}

export function NavItem({ icon, label, isActive, onClick, badge }: NavItemProps) {
    return (
        <div
            onClick={onClick}
            className={`w-full group flex items-center justify-between px-4 py-3 rounded-2xl transition-all relative overflow-hidden cursor-pointer ${isActive
                ? 'text-white'
                : 'text-zinc-500 hover:text-zinc-200'
                }`}
        >
            {isActive && (
                <motion.div
                    layoutId="nav-bg"
                    className="absolute inset-0 bg-linear-to-r from-rose-500/20 to-transparent border-l-2 border-rose-500"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
            )}

            <div className="flex items-center gap-3 relative z-10">
                <span className={`transition-colors ${isActive ? 'text-rose-500' : 'group-hover:text-rose-400'}`}>
                    {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<{ size?: number }>, { size: 20 }) : icon}
                </span>
                <span className="font-medium text-sm tracking-wide">{label}</span>
            </div>

            {badge && (
                <span className="relative z-10 bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-[0_0_10px_rgba(225,29,72,0.3)]">
                    {badge}
                </span>
            )}
        </div>
    );
}
