import { Env } from '../constants/enums/env.enum';
import { assertToBeDefined, isDevOrTestEnv, isEnvCorrect } from './index';

describe('[helpers/index]', () => {
  describe('#isEnvCorrect', () => {
    it('should return true if the environment value is known', () => {
      expect(isEnvCorrect('development')).toBe(true);
    });

    it('should return false if the environment value is unknown', () => {
      expect(isEnvCorrect('1')).toBe(false);
    });

    it('should return false if the environment value is undefined', () => {
      expect(isEnvCorrect(undefined)).toBe(false);
    });
  });

  describe('#isDevOrTestEnv', () => {
    it('should return true if the environment value is development', () => {
      expect(isDevOrTestEnv(Env.DEVELOPMENT)).toBe(true);
    });

    it('should return true if the environment value is test', () => {
      expect(isDevOrTestEnv(Env.TEST)).toBe(true);
    });

    it('should return false if the environment value is not dev or test', () => {
      expect(isDevOrTestEnv(Env.PROD)).toBe(false);
    });
  });

  describe('#assertToBeDefined', () => {
    it('should return actual value if it is defined', () => {
      expect(assertToBeDefined('toto')).toBe('toto');
    });

    it('should throw an error if the value is undefined', () => {
      expect(() => assertToBeDefined(undefined)).toThrowError(
        Error('Value not initialized'),
      );
    });

    it('should throw an error if the value is null', () => {
      expect(() => assertToBeDefined(null)).toThrowError(
        Error('Value not initialized'),
      );
    });
  });
});
