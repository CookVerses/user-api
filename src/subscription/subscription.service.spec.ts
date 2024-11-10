import { DataSource, Repository, EntityNotFoundError, ILike } from 'typeorm';

import { SubscriptionEntity } from './subscription.entity';
import { SubscriptionsService } from './subscriptions.service';

import { clearDataSource, setupDataSource } from '../../test/_utils_/db.util';
import { subscriptions } from '../../test/_fixtures_/subscription.fixture';

describe('[subscription] Subscriptions Service', () => {
  let dataSource: DataSource;
  let subscriptionsRepo: Repository<SubscriptionEntity>;

  let subscriptionsService: SubscriptionsService;

  beforeAll(async () => {
    dataSource = await setupDataSource();
    subscriptionsRepo = dataSource.getRepository(SubscriptionEntity);

    subscriptionsService = new SubscriptionsService(subscriptionsRepo);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await clearDataSource(dataSource);
  });

  describe('#getListOfSubscriptions', () => {
    let getSubscriptionsSpy: jest.SpyInstance;

    beforeAll(() => {
      getSubscriptionsSpy = jest.spyOn(subscriptionsRepo, 'find');
    });

    test('should correctly return list of subscriptions', async () => {
      getSubscriptionsSpy.mockResolvedValue(subscriptions);
      await expect(
        subscriptionsService.getListOfSubscriptions(),
      ).resolves.toEqual(subscriptions);
    });
  });
});
