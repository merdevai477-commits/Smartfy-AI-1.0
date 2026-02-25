interface AppEnv {
    apiUrl: string;
    appName: string;
    isDev: boolean;
    isProd: boolean;
}

function getEnv(): AppEnv {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!apiUrl) {
        throw new Error('NEXT_PUBLIC_API_URL environment variable is required');
    }

    return {
        apiUrl,
        appName: process.env.NEXT_PUBLIC_APP_NAME || 'SmartfyAI',
        isDev: process.env.NODE_ENV !== 'production',
        isProd: process.env.NODE_ENV === 'production',
    };
}

export const env = getEnv();
