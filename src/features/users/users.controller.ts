import {
    BadRequestException,
    Body,
    Controller,
    Get,
    Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserModel } from './user.model';
import { Auth } from '@shared/decorators/auth.decorator';

@Auth()
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    async getAll(): Promise<UserModel[]> {
        return this.usersService.getAllUsers();
    }

    @Get(':id')
    async getById(id: number): Promise<UserModel> {
        return this.usersService.getUserById(id);
    }

    @Post('upsert')
    async upsertUser(@Body() user: UserModel): Promise<UserModel> {
        if (user === undefined) {
            throw new BadRequestException(
                'User data is required for upsert operation',
            );
        }

        return this.usersService.upsertUser(user);
    }
}
