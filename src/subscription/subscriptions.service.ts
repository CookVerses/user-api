import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Logger } from '../services/logger.service';
import { SubscriptionEntity } from './subscription.entity';

@Injectable()
export class SubscriptionsService {
  private readonly logger = new Logger(SubscriptionsService.name);

  constructor(
    @InjectRepository(SubscriptionEntity)
    private subscriptionRepo: Repository<SubscriptionEntity>,
  ) {}

  async getListOfSubscriptions(): Promise<SubscriptionEntity[]> {
    const subscriptions = await this.subscriptionRepo.find();
    this.logger.log('Fetched list of subscriptions');
    return subscriptions;
  }
}
