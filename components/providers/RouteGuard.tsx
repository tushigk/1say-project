'use client';

import { useAuth } from './AuthProvider';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Loading from '../ui/Loading';

export function RouteGuard({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, user, isLoading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // Skip protection for public routes
        const publicRoutes = ['/login', '/register', '/age-gate', '/privacy', '/plans'];
        const isPublicRoute = publicRoutes.includes(pathname);
        const isPaymentPage = pathname.startsWith('/payment');

        if (isLoading) return;

        // 1. Age Gate Check
        const isAgeVerified = typeof window !== 'undefined' && localStorage.getItem('age_verified') === 'true';
        if (!isAgeVerified && pathname !== '/age-gate') {
            router.push('/age-gate');
            return;
        }

        // 2. Auth Check
        if (!isAuthenticated && !isPublicRoute && !isPaymentPage) {
            router.push('/login');
            return;
        }

        // 3. Membership & Route logic
        if (isAuthenticated && isAgeVerified) {
            const hasMembership = !!(user?.membershipExpiresAt && new Date(user.membershipExpiresAt) > new Date());

            // If authenticated but no active membership, force them to the plans page 
            // unless they are already on a public route, plans page, or payment page.
            if (!hasMembership && !isPublicRoute && !isPaymentPage && pathname !== '/plans') {
                router.push('/plans');
                return;
            }

            // If they HAVE a membership and are on a public route or plans page, send them home.
            if (hasMembership && (isPublicRoute || pathname === '/plans') && pathname !== '/privacy' && !isPaymentPage) {
                router.push('/discover');
                return;
            }
        }
    }, [isAuthenticated, user, isLoading, pathname, router]);

    // Derive the logic for showing content to avoid flashes
    const publicRoutes = ['/login', '/register', '/age-gate', '/privacy', '/plans'];
    const isPublicRoute = publicRoutes.includes(pathname);
    const isPaymentPage = pathname.startsWith('/payment');
    const isAgeVerified = typeof window !== 'undefined' ? localStorage.getItem('age_verified') === 'true' : false;
    const hasMembership = !!(user?.membershipExpiresAt && new Date(user.membershipExpiresAt) > new Date());

    const getShouldShow = () => {
        if (isLoading) return false;

        // Age Gate Check
        if (!isAgeVerified) {
            return pathname === '/age-gate';
        }

        // Auth Check
        if (!isAuthenticated) {
            return isPublicRoute || isPaymentPage;
        }

        // Authenticated Logic
        if (!hasMembership) {
            return isPublicRoute || isPaymentPage || pathname === '/plans';
        }

        // Has Membership - Check for reverse redirects
        const isAuthRoute = ['/login', '/register', '/plans'].includes(pathname);
        if (isAuthRoute && pathname !== '/privacy' && !isPaymentPage) {
            return false;
        }

        return true;
    };

    const shouldShow = getShouldShow();

    if (!shouldShow) {
        return <Loading fullScreen />;
    }

    return <>{children}</>;
}
