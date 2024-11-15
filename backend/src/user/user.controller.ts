// This base URL is http://localhost:xxxx/user


import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Res, Req, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Response, Request } from 'express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // POST http://localhost:process.env.PORT/user
  @Post('register')
  async create(@Body() createUserDto: CreateUserDto, @Res() res:Response) {
    try {
      const result = await this.userService.create(createUserDto);
      if (result.success) {
        return res.status(HttpStatus.OK).json({success:true, data: result.data});
      } else {
        return res.status(HttpStatus.CONFLICT).json({success:false, message:result.message});
      }
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({success:false, message:'Internal server error'});
    }
  }

  // GET http://localhost:process.env.PORT/user
  @Get('all')
  async findAll(@Res() res:Response) {
    try {
      const result = await this.userService.findAll();
      if(result.success) {
        return res.status(HttpStatus.OK).json({success:true, data: result.data});
      }
      else{
        return res.status(HttpStatus.UNAUTHORIZED).json({success:false, message:result.message});
      }
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({success:false, message:'Internal server error'});    
    }
  }

  // GET http://localhost:process.env.PORT/user/:id
  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res:Response) {
    try {
      const result = await this.userService.findOneById(id);
      if(result.success) {
        return res.status(HttpStatus.OK).json({success:true, data: result.data});
      }
      else{
        return res.status(HttpStatus.UNAUTHORIZED).json({success:false, message:result.message});
      }
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({success:false, message:'Internal server error'});    
    }
  }

  // PATCH http://localhost:process.env.PORT/user/:id
  @Patch (':id')
  async update(
    @Param('id') id: string, 
    @Res() res:Response,
    @Body() updateUserDto: UpdateUserDto, 
    @Body('currentPassword') currentPassword ?: string,
  ) {
    try {
      const result = await this.userService.update(id, updateUserDto, currentPassword);
      if(result.success) {
        return res.status(HttpStatus.OK).json({success:true, data: result.data});
      }
      else{
        return res.status(HttpStatus.UNAUTHORIZED).json({success:false, message:result.message});
      }
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({success:false, message:'Internal server error'});    
    }
  }

  // DELETE http://localhost:process.env.PORT/user/:id
  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res:Response) {
    try {
      const result = await this.userService.remove(id);
      if(result.success) {
        return res.status(HttpStatus.OK).json({success:true, data: result.data});
      }
      else{
        return res.status(HttpStatus.UNAUTHORIZED).json({success:false, message:result.message});
      }
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({success:false, message:'Internal server error'});    
    }
  }
}
