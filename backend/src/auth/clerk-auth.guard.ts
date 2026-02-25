import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClerkClient } from '@clerk/backend';
import { verifyToken } from '@clerk/backend';

@Injectable()
export class ClerkAuthGuard implements CanActivate {
    private clerk;
    private secretKey: string;

    constructor(private configService: ConfigService) {
        this.secretKey = this.configService.get<string>('CLERK_SECRET_KEY') || '';
        this.clerk = createClerkClient({
            secretKey: this.secretKey,
        });
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers.authorization;

        console.log('🔐 === AUTH GUARD: Checking authentication ===');
        console.log('Request URL:', request.url);
        console.log('Request Method:', request.method);

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            console.log('❌ Missing or invalid authorization header');
            throw new UnauthorizedException('Missing or invalid authorization header');
        }

        const token = authHeader.split(' ')[1];
        console.log('✅ Token found, length:', token.length);

        try {
            // Use the standalone verifyToken function from @clerk/backend
            console.log('🔍 Verifying token with Clerk...');
            const payload = await verifyToken(token, {
                secretKey: this.secretKey,
                // Add clock tolerance to handle slight time differences and token refresh delays
                clockSkewInMs: 180000, // 3 minutes tolerance
            });
            console.log('✅ Token verified successfully');
            console.log('User ID (sub):', payload.sub);
            request.user = { userId: payload.sub };
            console.log('=== AUTH GUARD: Authentication successful ===\n');
            return true;
        } catch (error) {
            console.error('=== ❌ AUTH GUARD: Token Verification Error ===');
            console.error('Error Type:', error.constructor.name);
            console.error('Error Message:', error.message);
            if (error.reason) console.error('Error Reason:', error.reason);
            console.error('==============================================\n');
            throw new UnauthorizedException('Invalid or expired token');
        }
    }
}
