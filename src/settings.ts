export const localCookieSettings = {
    httpOnly: true,
    secure: process.env.PRODUCTION === "true",
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: "lax" as const
};

export const deploymentCookieSettings = {
    httpOnly: true,
    secure: process.env.PRODUCTION === "true",
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: "none" as const
}