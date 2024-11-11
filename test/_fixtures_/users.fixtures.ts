import { UserEntity } from '../../src/user/user.entity';
import { Gender } from '../../src/constants/enums/gender.enum';
import { UserRole } from '../../src/constants/enums/user-role.enum';

export const users: UserEntity[] = [
  {
    id: '3a572a4b-6290-4682-ad3b-7908c3d87595',
    username: 'user',
    password: 'user',
    firstName: 'Phạm',
    lastName: 'Cường',
    gender: Gender.MALE,
    email: 'cuong@cookverse.com',
    role: UserRole.USER,
    dateOfBirth: new Date('2003-01-03T18:30:00.000Z'),
    phoneNumber: '+84909090909',
    createdAt: new Date('2024-11-10T07:10:25.091Z'),
    updatedAt: new Date('2024-11-10T07:10:25.091Z'),
  },
];
