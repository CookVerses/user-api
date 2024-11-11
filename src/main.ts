/* istanbul ignore file */
import { NestFactory } from '@nestjs/core';
import { RequestMethod } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import helmet from 'helmet';

import { AppModule } from './app.module';
import { Logger } from './services/logger.service';
import { config } from './config/index';

const logger = new Logger();

/* istanbul ignore next */
process.on('uncaughtException', (err) => {
  logger.error(err, err.stack, 'uncaughtException');
  process.exit(1);
});

/* istanbul ignore next */
process.on('unhandledRejection', (err: any) => {
  logger.error(err, err.stack, 'unhandledRejection');
  process.exit(1);
});

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger,
  });

  app.use(helmet());
  app.enableCors();

  app.set('json escape', true);
  app.setGlobalPrefix('api', {
    exclude: [{ path: 'docs', method: RequestMethod.GET }],
  });

  const docConfig = new DocumentBuilder()
    .setTitle('User API Documentation')
    .setDescription('Play with the API')
    .setVersion('1.0')
    .addBearerAuth({ type: 'http' }, 'user')
    .build();

  const document = SwaggerModule.createDocument(app, docConfig);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  await app.listen(config.PORT);
}
bootstrap();
