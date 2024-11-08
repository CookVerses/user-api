import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

import { ormConfig } from './config/ormconfig';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () =>
        ({
          ...ormConfig,
          autoLoadEntities: true,
        } as TypeOrmModuleOptions),
    }),
  ],
})
class DatabaseModule {}

export default DatabaseModule;
