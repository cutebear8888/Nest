import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm'; 
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { ResponseWrapper } from 'src/Helper/response.wrapper';
import { response } from 'express';

@Injectable()
export class UserService {
  //userRepository is a reference to the repository for the User entity and provides the necessary methods to interact with the User table in the database.
  constructor( @InjectRepository(User) private readonly userRepository:Repository<User>,)
  {}

  async create(createUserDto: CreateUserDto) : Promise<any> {
    try {
      const user:User = new User();
      user.firstname = createUserDto.firstname;
      user.lastname = createUserDto.lastname;
      user.email = createUserDto.email;
      user.password = createUserDto.password;
      user.role = createUserDto.role;
      return ResponseWrapper.success(this.userRepository.save(user));
      
    } catch (error) {
      return ResponseWrapper.failure('User creation failure');
    }
  }

  async findAll() : Promise<any> {
    try {
      const users = await this.userRepository.find();

      if(users.length >0) {
        return ResponseWrapper.success(users);
      }
      return ResponseWrapper.failure("No user found");
    } catch (error) {
      return ResponseWrapper.failure("An error occured while fetching users.");
    }
    return this.userRepository.find();
  }

  async findOne(id: number) {
    try {
      const user = await this.userRepository.findOneBy({id});
      if(!user){
        return ResponseWrapper.failure('User not found');
      }
      return ResponseWrapper.success(user);
    } catch (error) {
      return ResponseWrapper.failure('An error occured while fetching the user');
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto, currentPassword ?: string) : Promise<any> {
    try {
      const user = await this.userRepository.findOneBy({id});
      if(!user){
        return ResponseWrapper.failure('User not found');
      }
      user.firstname = updateUserDto.firstname;
      user.lastname = updateUserDto.lastname;
      user.email = updateUserDto.email;
      if(updateUserDto.password){
        if(!currentPassword || user.password !== currentPassword){
          throw new UnauthorizedException("Current password is incorrect");
        }
        user.password = updateUserDto.password;
      }
      const updateUser = await this.userRepository.save(user);
      return ResponseWrapper.success(updateUser);
    } catch (error) {
      return ResponseWrapper.failure("An error occured while updating the user");
    }
  }

  async remove(id: number) : Promise<any> {
    try {
      const result = await this.userRepository.delete(id);
      if(result.affected === 0){
        return ResponseWrapper.failure('User not found');
      }
      return ResponseWrapper.success({affected: result.affected});
    } catch (error) {
      return ResponseWrapper.failure('An error occured while deleting the user'); 
    }
  }
}
