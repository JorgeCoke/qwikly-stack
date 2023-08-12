export const Router = {
    index: "/",
    401: "/401",
    auth: {
        logIn: "/auth/log-in",
        logOut: "/auth/log-out",
        profile: "/auth/profile",
        resetPassword: "/auth/reset-password",
        setPassword: "/auth/set-password",
        signUp: "/auth/sign-up",
    },
    payments: {
        index: "/payments",
        error: "/payments/error",
        success: "/payments/success",
        webhooks: "/payments/webhooks",
    },
    termsAndConditions: "/terms-and-conditions",
    admin: {
        index: "/admin",
        dashboard: {
            index: "/admin/dashboard",
            users: {
                index: "/admin/dashboard/users",
                new: "/admin/dashboard/users/new",
                id: "/admin/dashboard/users"
            },
        },
        landing: "/admin/landing",
        access: "/admin/access"
    },
    health: "/health",
} as const;

export type Route = (typeof Router)[keyof typeof Router];