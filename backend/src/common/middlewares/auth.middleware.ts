import { HttpStatus, Injectable, NestMiddleware } from "@nestjs/common";
import exp from "constants";
import { Request, Response, NextFunction } from "express";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: any, res: any, next: NextFunction) {
    const user = req.user;
    if(user && user.role==='admin'){
      next();
    } else {
      return res.status(HttpStatus.BAD_REQUEST).json({success:false, message:'Access denied'});
    }
  }
}

// you should add this middle ware into user and app Moudule and main.ts file