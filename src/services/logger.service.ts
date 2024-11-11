import {
  Injectable,
  LoggerService as NestLoggerService,
  NestMiddleware,
} from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import pino from 'pino';
import * as pinoHttp from 'pino-http';
import { NextFunction, Request, Response } from 'express';

import { ApiError, ErrorResponseFormat } from '../errors/exceptions';
import { RESPONSE_API_ERROR_SYMBOL } from '../errors/exception-filter';
import { config } from '../config/index';
import { Env } from '../constants/enums/env.enum';
import { isDevOrTestEnv } from '../helpers';

const loggerConfig = {
  base: {
    env: config.ENV,
    project: config.PROJECT_NAME,
  },
  messageKey: 'message',
  level: config.LOG_LEVEL,
  timestamp: () => `,"timestamp":"${new Date().toISOString()}"`,
  formatters: {
    level(label: string) {
      return { level: label };
    },
  },
};

const mainLogger = pino({
  ...loggerConfig,
  ...(config.ENV === Env.DEVELOPMENT
    ? {
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: isDevOrTestEnv(config.ENV),
          },
        },
      }
    : {}),
});

/* istanbul ignore next */
export class Logger implements NestLoggerService {
  logger: pino.Logger;

  constructor(private readonly context?: string) {
    this.logger = mainLogger.child({ context: this.context });
  }

  log = (message: string | any, ctx?: string) =>
    this.printMessage(message, 'info', ctx);
  error = (message: any, trace?: string, ctx?: string) =>
    this.printMessage(message, 'error', ctx, trace);
  warn = (message: string | any, ctx?: string) =>
    this.printMessage(message, 'warn', ctx);
  debug = (message: string | any, ctx?: string) =>
    this.printMessage(message, 'debug', ctx);
  verbose = (message: string | any, ctx?: string) =>
    this.printMessage(message, 'verbose', ctx);

  printMessage = (
    message: any,
    level: string,
    context?: string,
    trace?: string,
  ) => {
    let log: any = {
      context,
      trace,
    };

    if (!context) {
      log.context = this.context;
    }

    if (message instanceof Error) {
      log.trace = log.trace || message.stack;
    }

    if (typeof message === 'object') {
      log = {
        ...log,
        ...message,
      };

      this.logger[level](log, message.message);
    } else {
      this.logger[level](log, message);
    }
  };

  child = (childCtx: string) => {
    const newCtx = this.context ? `${this.context}_${childCtx}` : childCtx;

    return new Logger(newCtx);
  };
}

/* istanbul ignore next */
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly httpLogger: pinoHttp.HttpLogger;

  constructor() {
    this.httpLogger = pinoHttp.pinoHttp({
      logger: mainLogger.child({ context: 'http' }),
      genReqId: () => uuid(),
      customLogLevel: (req, res, error) => {
        if (res.statusCode >= 500 || error) {
          return 'error';
        }

        return 'info';
      },
      serializers: {
        req(req) {
          if (req.headers) {
            req.headers_user_agent = req.headers['user-agent'];
          }

          req.headers = undefined;
          req.remotePort = undefined;
          req.body = req.raw.body;
          return req;
        },
        res(res) {
          res.headers = undefined;

          const exception: ApiError = res.raw[RESPONSE_API_ERROR_SYMBOL];

          if (exception) {
            const resBody = exception.getFullResponse() as ErrorResponseFormat;
            Object.assign(res, resBody);
          }

          return res;
        },
      },
    });
  }

  use(req: Request, res: Response, next: NextFunction) {
    if (req.path === '/health' || req.path === '/metrics') {
      return next();
    }

    return (this.httpLogger as any)(req, res, next);
  }
}
