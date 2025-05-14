import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');
  
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: { enableImplicitConversion: true },
      errorHttpStatusCode: 400,
      stopAtFirstError: false,
    }),
  );
  
  const config = new DocumentBuilder()
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  
  app.enableCors();
  
  try {
    const port = process.env.PORT || 3000;
    await app.listen(port);
    logger.log(`NestJS running on port ${port}`);
    logger.log(`GraphQL running on http://localhost:${port}/graphql`);
  } catch (error) {
    throw error
  }
}
bootstrap(); 