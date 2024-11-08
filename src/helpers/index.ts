import * as uuid from 'uuid';

import { Env } from '../constants/enums/env.enum';
import { BackofficeRole } from '../constants/enums/backoffice-role.enum';
import { JwtPayload } from '../constants/types/jwt-payload.type';
/**
 * Check if the env value is in the list of allowed environment
 *
 * @param {unknown} env   - the value needs to be check
 *
 * @return {boolean} if it is a correct environment
 */
export function isEnvCorrect(env: unknown): boolean {
  return Object.values(Env).includes(env as Env);
}

/**
 * Check if the environment is test or dev environment
 *
 * @param {string} env  - the environment
 *
 * @return {boolean} if it is Development or Test environment
 */
export function isDevOrTestEnv(env: Env): boolean {
  return env === Env.TEST || env === Env.DEVELOPMENT;
}

/**
 * Ensure if a value is not null or undefined
 * Throw an error is value is undefined or null
 *
 * @param {unknown} value   - the value need to be asserted
 *
 * @return {unknown} the actual value if it is defined
 */
export function assertToBeDefined(value: unknown) {
  if (!value) {
    throw new Error('Value not initialized');
  }

  return value;
}

/* istanbul ignore next */
/**
 * Get the current date
 */
export function getCurrentDate() {
  return new Date();
}

/* istanbul ignore next */
/**
 * Return uuid v4
 */
export function generateUuidV4() {
  return uuid.v4();
}
