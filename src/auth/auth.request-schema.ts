import { ApiBodyOptions } from '@nestjs/swagger';

export const loginBodySchema: ApiBodyOptions = {
  schema: {
    type: 'object',
    properties: {
      username: {
        type: 'string',
      },
      password: {
        type: 'string',
      },
    },
  },
};
