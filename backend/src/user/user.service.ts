import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm'; 
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  //userRepository is a reference to the repository for the User entity and provides the necessary methods to interact with the User table in the database.
  constructor( @InjectRepository(User) private readonly userRepository:Repository<User>,)
  {}

  create(createUserDto: CreateUserDto) : Promise<User> {
    const user:User = new User();
    user.firstname = createUserDto.firstname;
    user.lastname = createUserDto.lastname;
    user.email = createUserDto.email;
    user.password = createUserDto.password;
    user.role = createUserDto.role;
    return this.userRepository.save(user);
  }

  findAll() : Promise<User []> {
    return this.userRepository.find();
  }

  findOne(id: number) {
    return this.userRepository.findOneBy({id});
  }

  update(id: number, updateUserDto: UpdateUserDto) : Promise<User> {
    return this.userRepository.findOneBy({id}).then((user)=>{
      if(!user){
        throw new Error('User not found');
      }
      user.firstname = updateUserDto.firstname;
      user.lastname = updateUserDto.lastname;
      user.email = updateUserDto.email;
      user.password = updateUserDto.password;
      return this.userRepository.save(user);
    })

  }

  remove(id: number) : Promise<{affected?:number}> {
    return this.userRepository.delete(id);
  }
}
