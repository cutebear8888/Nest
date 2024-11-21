import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { LoginDto } from './dto/login.dto';
import { Response, Request } from 'express';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}


  @Get('csrf-token')
  getCsrfToken(@Req() req: Request, @Res() res: Response) {
    const csrfToken = req.csrfToken(); // Generate CSRF token
    res.cookie('XSRF-TOKEN', csrfToken, {
      httpOnly: false, // Allow frontend access
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      sameSite: 'lax', // Prevent CSRF attacks
    });
    return res.status(200).send({ csrfToken });
  }
  // POST http://localhost:process.env.PORT/login
  @Post('login')
  async login(@Body() loginDto:LoginDto, @Res() res:Response){
    try {
      const result = await this.authService.validateUser(loginDto);
      if(result.success){
        res.cookie('access_token', result.data.accessToken, { 
          httpOnly: true, 
          secure: true,
          maxAge: 15 * 60 * 1000,
        });
        res.cookie('refresh_token', result.data.refreshToken, { 
          httpOnly: true, 
          secure: true, 
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        return res.status(HttpStatus.OK).json({success:true, data:result.data.user});
      } else {
        return res.status(HttpStatus.UNAUTHORIZED).json({success:false, message:result.message});
      }
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({success:false, message:'Internal server error'});
    }
  }

  
  @Get('datafromtoken')
  @UseGuards(AuthGuard)
  async getDataFromToken(@Req() req:Request, @Res() res:Response){
    try {
      const user = req.user;
      
      if(!user){
        return res.status(HttpStatus.UNAUTHORIZED).json({success:false, message:"Invalid User"});
      }
      return res.status(HttpStatus.OK).json({success:true, data:user});
    } catch(error){
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({success:false, message:'Internal server error'});
    }
  }

  @Post('refreshToken')
  @UseGuards(AuthGuard)
  async refresh(@Req() req:Request, @Res() res:Response){
    try {
      const refreshToken = req.cookies['refresh_token'];

      if(!refreshToken){
        return res.status(HttpStatus.UNAUTHORIZED).json({success:false, message:'Refresh token missing'});
      }
      const result = await this.authService.refreshToken(refreshToken);
      if(result.success){
        res.cookie('access_token', result.data.accessToken,{
          httpOnly: true,
          secure: true,
          maxAge: 15 * 60 * 1000,
        });
        return res.status(HttpStatus.OK).json({success:true, data:'Token refreshed'});
      } else {
        return res.status(HttpStatus.UNAUTHORIZED).json({success:false, message:result.message});
      }
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({success:false, message:'Internal server error'});
    }
  }

  
  @Post('logout/:id')
  @UseGuards(AuthGuard)
  async logout(@Param('id') id:string, @Res() res:Response){
    try {
      const result = await this.authService.logout(id);
      if(result.success){
        res.clearCookie('access_token');
        res.clearCookie('refresh_token');
        return res.status(HttpStatus.OK).json({success:true, data:'Logout successfully'});
      } else {
        return res.status(HttpStatus.UNAUTHORIZED).json({success:false, message:result.message});
      }
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({success:false, message:'Internal server error'});
    }
  }
}
