import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UserService } from "../services";
import { CreateUserDto, UpdateUserDto } from '../dto';
import { JwtAuthGuard } from 'src/auth/guards';
import { UserEntity } from '../entities/user.entity';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Post()
    async create(@Body() createUserDto: CreateUserDto) {
        return new UserEntity(await this.userService.create(createUserDto));
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    async findAll(@Param('page') page: number) {
        const result:any = await this.userService.findAll(page);
        result.data = result.data?.map((user: Partial<UserEntity>) => new UserEntity(user));
        return result;
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return new UserEntity(await this.userService.findOne(+id));
    }

    @Get('/unique/:uniqueField')
    async findUnique(@Param('uniqueField') uniqueField: string) {
        return new UserEntity(await this.userService.findUnique(uniqueField));
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return new UserEntity(await this.userService.update(+id, updateUserDto));
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return new UserEntity(await this.userService.remove(+id));
    }
}