import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as csrf from 'csurf'
import * as cookieParser from 'cookie-parser'
import * as cors from "cors"
import * as dotenv from 'dotenv'
import { AuthMiddleware } from './common/middlewares/auth.middleware';
import { JwtService } from '@nestjs/jwt';

// import { AuthMiddleware } from './common/middlewares/auth.middleware';
// import { JwtService } from '@nestjs/jwt';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // this part is used to introduce the validation such as password and email
  // ensures that only the expected data is processed, removing any unexpected fields from the request body.
  
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));

  // Use cookieParser
  app.use(cookieParser());

  // Use Cors
  app.use(
    cors({
      origin: (origin, callback) => {
        const allowedOrigins = [process.env.FRONT_SITE_URL];
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, origin);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true,
    })
  );

  // Use csrf
  app.use(
    csrf({
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        sameSite: 'lax', // Prevent CSRF attacks
      },
    }),
  );

  // const authmiddleware = new AuthMiddleware(JwtService);
  // // User MiddleWare
  // // Register middleware globally
  // app.use(authMiddleware.use.bind(authMiddleware)); // Use middleware function

  await app.listen(process.env.PORT);
}
bootstrap();
