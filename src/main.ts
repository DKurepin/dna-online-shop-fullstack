import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as hbs from 'express-handlebars';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';


async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.engine(
    'hbs',
    hbs.engine({
      extname: 'hbs',
      defaultLayout: 'layout',
      layoutsDir: join(__dirname, '..', 'views/layouts'),
      partialsDir: join(__dirname, '..', 'views/partials'),
    }),
  );
  app.setViewEngine('hbs');

  const config = new DocumentBuilder()
    .setTitle('WebConceptStore API')
    .setDescription(
      'The Web Concept Store API has a full range of endpoints for a webshop for all data models',
    )
    .setVersion('1.0')
    .addTag('WebConceptStore')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.use(cookieParser());

    app.enableCors({
        origin: 'https://dna-online-shop.onrender.com',
        credentials: true,
    });
  // Get the port from the environment variable, or fallback to a default port
  const port = process.env.PORT || 3000;
  await app.listen(port);
}

bootstrap();
