import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';
import { User } from './user/entities/user.entity';

// import { NestModule, MiddlewareConsumer } from '@nestjs/common';
// import { AuthMiddleware } from './common/middlewares/auth.middleware';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      password: 'cutebear777.C',
      username: 'postgres',
      entities: [User],
      database: 'pgWithNest',
      synchronize: true,
      logging: true,
    }),
    UserModule,
    AuthModule,
    ProductModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
// export class AppModule implements NestModule {
//   configure(consumer: MiddlewareConsumer) {
//     consumer
//       .apply(AuthMiddleware)  // Apply middleware here
//       .forRoutes('*');  // Apply to all routes or specify specific routes
//   }
// }