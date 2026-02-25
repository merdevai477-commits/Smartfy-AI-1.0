import { IsArray, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateProfileDto {
    @IsOptional()
    @IsString()
    @MaxLength(255)
    name?: string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    email?: string;

    @IsOptional()
    @IsString()
    @MaxLength(10)
    country?: string;

    @IsOptional()
    @IsString()
    @MaxLength(10)
    preferredLanguage?: string;

    @IsOptional()
    @IsString()
    @MaxLength(64)
    fieldOfInterest?: string;

    @IsOptional()
    @IsString()
    @MaxLength(191)
    brandName?: string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    address?: string;

    @IsOptional()
    @IsString()
    @MaxLength(500)
    tone?: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    marketingTypes?: string[];

    @IsOptional()
    @IsString()
    @MaxLength(20)
    phone?: string;
}
