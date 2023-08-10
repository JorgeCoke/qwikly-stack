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
        users: {
            index: "/admin/users",
            new: "/admin/users/new",
            id: "/admin/users"
        },
    },
    health: "/health"
} as const;

export type Route = (typeof Router)[keyof typeof Router];