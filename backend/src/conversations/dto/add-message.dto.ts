import { IsString, IsIn, IsOptional } from 'class-validator';

export class AddMessageDto {
    @IsString()
    @IsIn(['user', 'assistant'])
    role: string;

    @IsString()
    content: string;

    @IsOptional()
    @IsString()
    imageData?: string;

    @IsOptional()
    @IsString()
    imageMimeType?: string;

    imageSizeBytes?: number;
}
