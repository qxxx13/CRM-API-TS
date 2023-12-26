import { Body, Controller, Get, Param, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '@prisma/client';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get(':id')
    async getUserById(@Param('id') id: number) {
        return this.userService.getById(id);
    }

    @Get('')
    async getAllUsers() {
        return this.userService.getAll();
    }

    @Post('')
    @UsePipes(new ValidationPipe())
    async create(@Body() dto: User) {
        return this.userService.create(dto);
    }
}
