import { MiddlewareConsumer, Module } from '@nestjs/common';

import DatabaseModule from './database.module';
import { LoggerMiddleware } from './services/logger.service';

@Module({
  imports: [],
  controllers: [],
  providers: [],
})
export class AppModule {}
