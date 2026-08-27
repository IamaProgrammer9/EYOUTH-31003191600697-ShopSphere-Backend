/**
 * Configuration object for JWT signing and expiration settings.
 * Contains secrets and expiration times loaded from environment variables.
 */
export const authConfig = {
    /**
     * Secret key used for signing JWT access tokens.
     * @type {string}
     */
    secret: process.env.AUTH_SECRET as string,
    /**
     * Expiration time for the JWT access token (e.g., "15m" for 15 minutes).
     * @type {string}
     */
    secret_expires_in: process.env.AUTH_SECRET_EXPIRES_IN as string,
    /**
     * Secret key used for signing JWT refresh tokens.
     * @type {string}
     */
    refresh_secret: process.env.AUTH_REFRESH_SECRET as string,
    /**
     * Expiration time for the JWT refresh token (e.g., "24h" for 24 hours).
     * @type {string}
     */
    refresh_secret_expires_in: process.env.AUTH_REFRESH_SECRET_EXPIRES_IN as string
    
};

export default authConfig;