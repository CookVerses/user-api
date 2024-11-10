import { MiddlewareConsumer, Module } from '@nestjs/common';

import DatabaseModule from './database.module';
import { LoggerMiddleware } from './services/logger.service';
import { SubscriptionsModule } from './subscription/subscriptions.module';
import { UsersModule } from './user/users.module';

@Module({
  imports: [DatabaseModule, SubscriptionsModule, UsersModule],

  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).exclude('/docs').forRoutes('/');
  }
}
