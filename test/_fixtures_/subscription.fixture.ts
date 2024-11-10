import { SubscriptionEntity } from '../../src/subscription/subscription.entity';
import { SubscriptionStatus } from '../../src/constants/enums/subscription-status';

import { users } from './users.fixtures';

export const subscriptions: SubscriptionEntity[] = [
  {
    id: 'e5d33c13-b2f2-432a-97c3-844690150ed3',
    status: SubscriptionStatus.Active,
    startDate: new Date('2022-11-17T18:30:00.000Z'),
    endDate: new Date('2022-11-24T18:30:00.000Z'),
    createdAt: new Date('2022-11-17T18:30:00.000Z'),
    updatedAt: new Date('2022-11-17T18:30:00.000Z'),
    user: users[0],
    name: 'Basic',
  },
  {
    id: '5cb97020-000e-40fa-a610-1176a7984d6a',
    status: SubscriptionStatus.Inactive,
    startDate: new Date('2022-11-17T18:30:00.000Z'),
    endDate: new Date('2022-12-17T18:30:00.000Z'),
    createdAt: new Date('2022-11-17T18:30:00.000Z'),
    updatedAt: new Date('2022-11-17T18:30:00.000Z'),
    user: users[0],
    name: 'Gold',
  },
  {
    id: 'e5d33c13-b2f2-432a-97c3-844690150fd9',
    status: SubscriptionStatus.Cancelled,
    startDate: new Date('2022-11-17T18:30:00.000Z'),
    endDate: new Date('2023-02-17T18:30:00.000Z'),
    createdAt: new Date('2022-11-17T18:30:00.000Z'),
    updatedAt: new Date('2022-11-17T18:30:00.000Z'),
    user: users[0],
    name: 'Premium',
  },
];
