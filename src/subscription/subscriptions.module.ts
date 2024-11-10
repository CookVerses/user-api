import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SubscriptionEntity } from './subscription.entity';
import { SubscriptionController } from './subscriptions.controller';
import { SubscriptionsService } from './subscriptions.service';
import { JwtStrategy } from '../auth/jwt.strategy';

@Module({
  imports: [TypeOrmModule.forFeature([SubscriptionEntity])],
  controllers: [SubscriptionController],
  providers: [SubscriptionsService, JwtStrategy],
})
export class SubscriptionsModule {}
