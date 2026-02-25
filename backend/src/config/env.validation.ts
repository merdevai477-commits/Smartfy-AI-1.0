import { plainToInstance } from 'class-transformer';
import {
    IsEnum,
    IsNumber,
    IsString,
    validateSync,
    IsOptional,
} from 'class-validator';

enum Environment {
    Development = 'development',
    Production = 'production',
    Staging = 'staging',
    Test = 'test',
}

class EnvironmentVariables {
    @IsEnum(Environment)
    @IsOptional()
    NODE_ENV: Environment = Environment.Development;

    @IsNumber()
    @IsOptional()
    PORT: number = 3000;

    @IsString()
    MONGODB_URI: string;

    @IsString()
    @IsOptional()
    ALLOWED_ORIGINS: string;

    @IsString()
    @IsOptional()
    FRONTEND_URL: string;

    @IsString()
    @IsOptional()
    CLERK_SECRET_KEY: string;

    @IsString()
    @IsOptional()
    JWT_SECRET: string;

    @IsString()
    @IsOptional()
    JWT_EXPIRATION: string;

    @IsString()
    @IsOptional()
    GEMINI_API_KEY: string;

    @IsString()
    @IsOptional()
    GROQ_API_KEY: string;

    @IsString()
    @IsOptional()
    AI_PROVIDER: string;
}

export function validate(config: Record<string, unknown>) {
    const validatedConfig = plainToInstance(EnvironmentVariables, config, {
        enableImplicitConversion: true,
    });
    const errors = validateSync(validatedConfig, {
        skipMissingProperties: false,
    });

    if (errors.length > 0) {
        throw new Error(`Environment validation failed:\n${errors.toString()}`);
    }
    return validatedConfig;
}
