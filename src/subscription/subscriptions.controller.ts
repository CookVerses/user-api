import { Controller, Get, UseFilters, UsePipes } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AllExceptionsFilter } from '../errors/exception-filter';
import validationPipe from '../validation-pipe';
import { SwaggerTags } from '../constants/enums/swagger-tags.enum';
import { SubscriptionsService } from './subscriptions.service';

@UsePipes(validationPipe())
@UseFilters(AllExceptionsFilter)
@ApiTags(SwaggerTags.SUBSCRIPTIONS)
@Controller('subscriptions')
export class SubscriptionController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Get('/')
  getSubscriptions() {
    return this.subscriptionsService.getListOfSubscriptions();
  }
}
