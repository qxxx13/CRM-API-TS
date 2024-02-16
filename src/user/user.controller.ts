import { Body, Controller, Delete, Get, Param, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '@prisma/client';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get(':id')
    async getUserById(@Param('id') id: string) {
        return this.userService.getById(+id);
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

    @Delete(':id')
    async deleteOrder(@Param('id') id: string) {
        return this.userService.delete(id);
    }

    @Get('interest/:id')
    async getUserInterestRate(@Param('id') id: string) {
        return this.userService.getInterestRateById(id);
    }
}
