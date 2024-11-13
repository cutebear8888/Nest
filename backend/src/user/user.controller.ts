// This base URL is http://localhost:xxxx/user


import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // POST http://localhost:3000/user
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  // GET http://localhost:3000/user
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  // GET http://localhost:3000/user/:id
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.userService.findOne(+id);
  }

  // PATCH http://localhost:3000/user/:id
  @Patch (':id')
  async update(
    @Param('id') id: number, 
    @Body() updateUserDto: UpdateUserDto, 
    @Body('currentPassword') currentPassword?: string
  ) {
    return this.userService.update(id, updateUserDto, currentPassword);
  }

  // DELETE http://localhost:3000/user/:id
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.userService.remove(+id);
  }
}
