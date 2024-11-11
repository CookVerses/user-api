import { ApiBodyOptions } from '@nestjs/swagger';

export const loginBodySchema: ApiBodyOptions = {
  schema: {
    type: 'object',
    properties: {
      username: {
        type: 'string',
        default: 'user123',
      },
      password: {
        type: 'string',
        default: 'userpassword',
      },
    },
  },
};

export const registerBodySchema: ApiBodyOptions = {
  schema: {
    type: 'object',
    properties: {
      username: {
        type: 'string',
        default: 'username',
      },
      password: {
        type: 'string',
        default: 'password',
      },
      firstName: {
        type: 'string',
        default: 'firstName',
      },
      lastName: {
        type: 'string',
        default: 'lastName',
      },
      email: {
        type: 'string',
        default: 'example@example.com',
      },
    },
  },
};
