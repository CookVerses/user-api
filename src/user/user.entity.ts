import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsOptional,
  IsPhoneNumber,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';

import { EntityName } from '../constants/enums/entity-name.enum';
import { IsTrimmedStringWithoutTab } from '../constants/validators/trimmed-string-without-tab.validator';
import { DateTransformer } from '../constants/transformers/date.transformer';
import { Gender } from '../constants/enums/gender.enum';
import { UserRole } from '../constants/enums/user-role.enum';
import { SubscriptionEntity } from '../subscription/subscription.entity';

@Entity(EntityName.USER)
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  @IsOptional()
  @IsUUID()
  id!: string;

  @Column({
    nullable: false,
    unique: true,
  })
  @IsTrimmedStringWithoutTab()
  username: string;

  @Column({
    nullable: false,
    select: false,
  })
  @IsTrimmedStringWithoutTab()
  password!: string;

  @Column({
    nullable: false,
    name: 'first_name',
  })
  @IsTrimmedStringWithoutTab()
  firstName!: string;

  @Column({
    nullable: false,
    name: 'last_name',
  })
  @IsTrimmedStringWithoutTab()
  lastName!: string;

  @Column({
    type: 'enum',
    enum: Gender,
    nullable: true,
  })
  @IsOptional()
  @IsEnum(Gender)
  gender!: Gender;

  @Column({
    unique: true,
  })
  @IsEmail()
  email!: string;

  @Column({
    name: 'dob',
    type: 'timestamp',
    transformer: new DateTransformer(),
    nullable: true,
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dateOfBirth?: Date;

  @Column({
    name: 'phone_number',
    nullable: true,
  })
  @IsOptional()
  @IsPhoneNumber()
  phoneNumber?: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    nullable: true,
  })
  @IsOptional()
  @IsEnum(UserRole)
  role!: UserRole;

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

  @OneToMany(() => SubscriptionEntity, (subscription) => subscription.user)
  subscription?: SubscriptionEntity;
}
