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
    users: {
        index: "/users",
        new: "/users/new",
        id: "/users"
    } 
} as const;

export type Route = (typeof Router)[keyof typeof Router];