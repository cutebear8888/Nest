import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authService: AuthService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean>{
    
    try {
      const request = context.switchToHttp().getRequest();
      const token = request.cookies['access_token'];
      console.log("This is the Token \n" + token);
      if (!token) return false;
      
      const decoded = this.jwtService.verify(token, { secret:process.env.JWT_SECRET });
      const user = await this.authService.userData(decoded.user_id);
      
      // If the user does not exist, throw an exception
      if(!user){
        throw new UnauthorizedException({ success: false, message: 'Invalid user.' });
      }
      // Should create request.user variable in the src/types/express.d.ts
      request.user = user.data;
      return true;
    } catch (error) {
      throw new UnauthorizedException({success:false, message:'Invalid or expired token'});
    }
  }
}