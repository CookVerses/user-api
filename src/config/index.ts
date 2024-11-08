/* istanbul ignore file */
import { isEnvCorrect } from '../helpers';
import { ENV, initializeValue } from './ormconfig';

const sampleJwtPublicKey =
  '-----BEGIN PUBLIC KEY-----\n' +
  'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA0EMm7PBjV8crTmXCnSXX\n' +
  'Fceji1Kia940X6PXvVJ6tixbUoFBEsR+htckmhZWh7gtwVVDhxM6I+G8G6RB6ie1\n' +
  '+pjbw4sk32wpmo8lSPM3RyACIWZrGchNZ4PM46PF4LhGg2jg8nszqiNIZ84zNSTa\n' +
  '927bspFI9ormy0R4zFYptDnT5EV8vnpqT9fnBrNUWUTvb54xda63HkNDBM9+uR/2\n' +
  'jXHiRQuF2r67+BvMn/CZ83WYkwRc85PPLkcOLWN1CZYX1VTOoaQTyP+iaBXvywkF\n' +
  'EC7vThh/yJ7oyHxBPmv3VMcyyvi4t34RCiPkbpEoifVonEtKzGPVi1MqITMP6AuY\n' +
  'PwIDAQAB\n' +
  '-----END PUBLIC KEY-----';

if (!isEnvCorrect(ENV)) {
  throw new Error(`Invalid environment: ${ENV}`);
}

export const config = {
  PROJECT_NAME: process.env.PROJECT_NAME || 'user-api',
  LOG_LEVEL: initializeValue(process.env.LOG_LEVEL, 'fatal'),
  PORT: parseInt(initializeValue(process.env.PORT, '3031') as string, 10),
  ENV,
  JWT: {
    PUBLIC_KEY: initializeValue(process.env.JWT_PUBLIC_KEY, sampleJwtPublicKey),
  },
};
