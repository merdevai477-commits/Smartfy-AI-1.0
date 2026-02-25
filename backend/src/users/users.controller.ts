import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { ClerkAuthGuard } from '../auth/clerk-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get('me')
    @UseGuards(ClerkAuthGuard)
    async getMe(@CurrentUser() clerkId: string) {
        return this.usersService.findOrCreate(clerkId);
    }

    @Patch('me')
    @UseGuards(ClerkAuthGuard)
    async updateMe(@CurrentUser() clerkId: string, @Body() dto: UpdateProfileDto) {
        return this.usersService.updateProfile(clerkId, dto);
    }
}
