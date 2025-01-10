import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TextModule } from './text/text.module';
import { ImageModule } from './image/image.module';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        APP_PORT: Joi.number().positive().default(3000),
        GEMINI_API_KEY: Joi.string().required(),
      }),
      validationOptions: {
        abortEarly: true,
      },
    }),
    TextModule,
    ImageModule,
  ],
})
export class AppModule {}
