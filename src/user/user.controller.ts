import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    UploadedFile,
    UseInterceptors,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Role, User, UserStatus } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get(':id')
    async getUserById(@Param('id') id: string) {
        return this.userService.getById(+id);
    }

    @Get('')
    async getAllUsers(@Query('role') role: Role | 'all') {
        return this.userService.getAll(role);
    }

    @Post('')
    @UsePipes(new ValidationPipe())
    async create(@Body() dto: User) {
        return this.userService.create(dto);
    }

    @Post('/edit')
    @UsePipes(new ValidationPipe())
    async edit(@Body() dto: User) {
        return this.userService.edit(dto);
    }

    @Post('/avatar')
    @UseInterceptors(FileInterceptor('file'))
    async addAvatar(@Query('userId') userId: string, @UploadedFile() file: Express.Multer.File) {
        return this.userService.addAvatar(+userId, file.buffer, file.originalname);
    }

    @Delete(':id')
    async deleteOrder(@Param('id') id: string) {
        return this.userService.delete(id);
    }

    @Get('interest/:id')
    async getUserInterestRate(@Param('id') id: string) {
        return this.userService.getInterestRateById(id);
    }

    @Patch('status')
    async toggleUserStatus(@Query('id') userId: string, @Query('status') status: UserStatus) {
        return this.userService.toggleStatus(userId, status);
    }
}
