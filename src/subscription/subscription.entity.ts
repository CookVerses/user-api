import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsEnum, IsOptional, IsUUID } from 'class-validator';

import { EntityName } from '../constants/enums/entity-name.enum';
import { SubscriptionStatus } from '../constants/enums/subscription-status';
import { DateTransformer } from '../constants/transformers/date.transformer';
import { UserEntity } from '../user/user.entity';
import { IsTrimmedStringWithoutTab } from '../constants/validators/trimmed-string-without-tab.validator';

@Entity(EntityName.SUBSCRIPTION)
export class SubscriptionEntity {
  @PrimaryGeneratedColumn('uuid')
  @IsOptional()
  @IsUUID()
  id!: string;

  @Column({
    type: 'enum',
    enum: SubscriptionStatus,
    nullable: false,
  })
  @IsEnum(SubscriptionStatus)
  status!: SubscriptionStatus;

  @CreateDateColumn({
    name: 'start_date',
    transformer: new DateTransformer(),
  })
  startDate: Date;

  @UpdateDateColumn({
    name: 'end_date',
    transformer: new DateTransformer(),
  })
  endDate: Date;

  @CreateDateColumn({
    name: 'created_at',
    transformer: new DateTransformer(),
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    transformer: new DateTransformer(),
  })
  updatedAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.subscription)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({
    nullable: false,
  })
  @IsTrimmedStringWithoutTab()
  name!: string;
}
