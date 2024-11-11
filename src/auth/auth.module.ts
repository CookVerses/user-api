import { Module } from '@nestjs/common';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserEntity } from '../user/user.entity';
import { config } from '../config/index';
import { JwtStrategy } from './jwt.strategy';
import { AuthSubscriber } from './auth.subscriber';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: async () => {
        const options: JwtModuleOptions = {
          privateKey: config.JWT.PRIVATE_KEY,
          publicKey: config.JWT.PUBLIC_KEY,
          signOptions: {
            expiresIn: config.JWT.EXPIRATION,
            issuer: config.PROJECT_NAME,
            algorithm: 'RS256',
          },
        };

        return options;
      },
    }),
    TypeOrmModule.forFeature([UserEntity]),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthSubscriber, JwtStrategy],
})
export class AuthModule {}
