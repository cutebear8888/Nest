import { Injectable } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { Strategy } from 'passport-jwt'
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt } from 'passport-jwt';
import { Request } from "express";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
  // Create the readonly reference of UserService
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([(req: Request) => req.cookies['access_token']]),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    const user = await this.userService.findOneById(payload.userId);
    if(!user) {
      return {success: false, message:'User not found'};
    }
    return { userId: payload.userId, role: payload.role };
  }
}