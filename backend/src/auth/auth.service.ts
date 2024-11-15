import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt'
import { LoginDto } from './dto/login.dto';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { InjectRepository } from '@nestjs/typeorm';


@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService:JwtService,
    @InjectRepository(User) private readonly userRepository:Repository<User>, // Inject the repository here
    private readonly userService:UserService,
  ){}

  async validateUser(loginDto:LoginDto){
    const {email, password} = loginDto;
    try {
      const result = await this.userService.findOneByEmail(email);
      if(!result.success) {
        return {success:false, message:'User not found'};
      }
      const user = result.data;
      const passwordValid = await bcrypt.compare(password, user.password);
      if(!passwordValid) {
        return {success:false, message:'Invalid password'};
      }
  
      const accessToken = this.jwtService.sign({user_id:user.user_id, role:user.role, type:'access'}, {expiresIn:'15m', secret: process.env.JWT_SECRET});
      const refreshToken = this.jwtService.sign({user_id:user.user_id, role:user.role, type:'refresh'}, {expiresIn:'7d', secret: process.env.JWT_SECRET});
      return {success:true, data:{accessToken, refreshToken, user}};
      
    } catch (error) {
      return {success:false, message:"An error occured while validate user."};
    }
  }

  async userData(user_id:string){
    try {
      const result = await this.userService.findOneById(user_id);
      if(!result.success){
        return {success:false, message:'User not found'};
      }
      return {success:true, data:result.data}
    } catch (error) {
      return {success:false, message:"An error occured while validate user."};
    }
  }

  async refreshToken(refreshToken:string) {
    try {
      // Verify the RefreshToken
      const payload = this.jwtService.verify(refreshToken, {secret: process.env.JWT_SECRET});
      const id = payload.userId;
      // Fetch user Details(optional step)
      const result = await this.userService.findOneById(id);
      if(!result.success){
        return {success:false, message:'User not found'};
      }
      const user = result.data;
      // Generate a new accessToken
      const newAccessToken = this.jwtService.sign({user_id:user.user_id, role:user.role, type:'access'}, {expiresIn:'15m'});
      return {success:true, data:{accessToken:newAccessToken}}
    } catch (error) {
      return {success:false, message:'Please login first'};
    }
  }

  async logout(id: string): Promise<any>{
    try {
      const user = await this.userService.findOneById(id);
      if(!user){
        return {success:false, message:'User not found'};
      }
      return { success:true, data:user };
    } catch (error) {
      return {success:false, message:'An error occured while fetching the user'}
    }
  }
}
