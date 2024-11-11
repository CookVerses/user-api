import { InjectDataSource } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import * as _ from 'lodash';
import { validate } from 'class-validator';

import { Logger } from '../services/logger.service';
import { getCurrentDate } from '../helpers/index';
import { UserEntity } from '../user/user.entity';

@Injectable()
@EventSubscriber()
export class AuthSubscriber implements EntitySubscriberInterface<UserEntity> {
  readonly logger: Logger = new Logger(AuthSubscriber.name);

  constructor(@InjectDataSource() readonly connection: DataSource) {
    connection.subscribers.push(this);
  }

  listenTo() {
    return UserEntity;
  }

  async beforeInsert(event: InsertEvent<UserEntity>) {
    event.entity.createdAt = event.entity.createdAt || getCurrentDate();
    event.entity.updatedAt = event.entity.updatedAt || getCurrentDate();

    const user = _.merge(new UserEntity(), event.entity);

    const errors = await validate(user, {
      validationError: { target: false, value: true },
    });

    if (errors.length > 0) {
      throw Error(`Invalid user: ${errors}`);
    }
  }

  beforeUpdate(event: UpdateEvent<UserEntity>) {
    if (event.entity) {
      event.entity.updatedAt = getCurrentDate();
    }
  }
}
