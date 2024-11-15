import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm'; 
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt'
import { compare, hash } from 'bcrypt'

@Injectable()
export class UserService {
  //userRepository is a reference to the repository for the User entity and provides the necessary methods to interact with the User table in the database.
  constructor( @InjectRepository(User) private readonly userRepository:Repository<User>,)
  {}

  async create(createUserDto: CreateUserDto) : Promise<any> {
    try {
      const user:User = new User();
      const hashedPassword  = await hash(createUserDto.password, 10);

      user.first_name = createUserDto.first_name;
      user.last_name = createUserDto.last_name;
      user.email = createUserDto.email;
      user.password = hashedPassword;
      user.role = createUserDto.role;
      return {success:true, data:this.userRepository.save(user)}
      
    } catch (error) {
      return {success:false, message:'User creation failure'}
    }
  }

  async findAll() : Promise<any> {
    try {
      const users = await this.userRepository.find();

      if(users.length >0) {
        return {success:true, data:users}
      }
      return {success:false, message:'No user found'};
    } catch (error) {
      return {success:false, message:"An error occured while fetching users."};
    }
  }

  async findOneById(user_id: string) {
    try {
      const user = await this.userRepository.findOneBy({user_id});
      if(!user){
        return {success:false, message:'User not found'};
      }
      return {success:true, data:user};
    } catch (error) {
      return {success:false, message:'An error occured while fetching the user'};
    }
  }

  async findOneByEmail(email:string): Promise<any> {
    try {
      const user = await this.userRepository.findOne({where:{email}});
      if(!user){
        return { success:false, message:'User not found'};
      }
      return {success:true, data:user};
    } catch (error) {
      return {success:false, message:'An error occured while fetching the user'}
    }
  }

  async update(user_id: string, updateUserDto: UpdateUserDto, currentPassword ?: string) : Promise<any> {
    try {
      const user = await this.userRepository.findOneBy({user_id});
      if(!user){
        return {success: false, message:'User not found'};
      }
      const passwordValid = await bcrypt.compare(currentPassword, user.password);

      user.first_name = updateUserDto.first_name;
      user.last_name = updateUserDto.last_name;
      user.email = updateUserDto.email;
      if(updateUserDto.password){
        if(!currentPassword || !passwordValid){
          return {success:false, message:"Current password is incorrect"};
        }
        user.password = await hash(updateUserDto.password, 10);
      }
      const updateUser = await this.userRepository.save(user);
      return {success: true, data:updateUser};
    } catch (error) {
      return {success: false, message:'An error occured while updating the user'};
    }
  }

  async remove(id: string) : Promise<any> {
    try {
      const result = await this.userRepository.delete(id);
      if(result.affected === 0){
        return {success:false, message:'User not found'};
      }
      return {success:true, data:{affected: result.affected}};
    } catch (error) {
      return {success:false, message:'An error occured while deleting the user'};
    }
  }
}
